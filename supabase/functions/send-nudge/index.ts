// supabase/functions/send-nudge/index.ts
// Email nudge engine for ACE Avionics Training
// Designed to run on cron/scheduler

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const resendKey = Deno.env.get('RESEND_API_KEY')!

async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ACE Avionics Training <training@aceavionicstraining.com>',
      to,
      subject,
      html,
    }),
  })
  return response.ok
}

function brandedEmail(title: string, body: string, ctaText: string, ctaUrl: string): string {
  return `
<div style="background:#0a0a0f;color:#e8e8e8;padding:40px;font-family:system-ui,sans-serif;">
  <h1 style="color:#D4A853;margin-bottom:20px;">${title}</h1>
  ${body}
  <div style="margin:30px 0;">
    <a href="${ctaUrl}" style="display:inline-block;background:#D4A853;color:#0a0a0f;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">${ctaText}</a>
  </div>
  <p style="margin-top:40px;color:#4B5270;font-size:12px;">
    <a href="https://learn.aceavionicstraining.com/unsubscribe?email={{email}}" style="color:#4B5270;">Unsubscribe</a>
  </p>
  <p style="margin-top:10px;color:#888;font-size:13px;">Built by Nick Brown. Air Force veteran. 500+ technicians trained.</p>
</div>`
}

Deno.serve(async () => {
  const sent: string[] = []

  // 1. Welcome sequence (enrolled but no activity in 48 hours)
  const { data: newEnrollments } = await supabase
    .from('ace_enrollments')
    .select('id, email')
    .eq('is_active', true)
    .is('last_login_at', null)
    .gte('created_at', new Date(Date.now() - 48 * 3600000).toISOString())
    .lte('created_at', new Date(Date.now() - 48 * 3600000).toISOString())

  for (const enrollment of newEnrollments || []) {
    const alreadySent = await supabase
      .from('ace_email_log')
      .select('id')
      .eq('enrollment_id', enrollment.id)
      .eq('email_type', 'welcome')
      .single()
    
    if (!alreadySent.data && enrollment.email) {
      const html = brandedEmail(
        'Welcome to ACE Avionics Training!',
        `<p>You're now enrolled in the CAET Entry-Level prep program.</p>
         <p>Here's how to get the most out of your training:</p>
         <ul style="color:#e8e8e8;line-height:1.8;">
           <li>Start with Module 1: Digital Systems</li>
           <li>Take practice drills to build mastery</li>
           <li>Use the mock exam when you hit 80%+ on drills</li>
         </ul>`,
        'Start Training',
        'https://learn.aceavionicstraining.com'
      )
      
      if (await sendEmail(enrollment.email, 'Welcome to ACE!', html)) {
        await supabase.from('ace_email_log').insert({
          enrollment_id: enrollment.id,
          email_type: 'welcome',
          email_address: enrollment.email,
        })
        sent.push(`welcome → ${enrollment.email}`)
      }
    }
  }

  // 2. Inactive students (no ace_question_events in 5+ days)
  const { data: inactiveStudents } = await supabase.rpc('get_inactive_students', { days: 5 })
  
  for (const student of inactiveStudents || []) {
    const alreadySent = await supabase
      .from('ace_email_log')
      .select('id')
      .eq('enrollment_id', student.enrollment_id)
      .eq('email_type', 're_engagement')
      .gte('sent_at', new Date(Date.now() - 7 * 86400000).toISOString())
    
    if (!alreadySent.data && student.email) {
      const html = brandedEmail(
        'Pick up where you left off',
        `<p>Hey ${student.name || 'there'},</p>
         <p>You were making great progress on ${student.last_module || 'your training'}. The best time to continue is now — muscle memory is still fresh.</p>`,
        'Resume Training',
        'https://learn.aceavionicstraining.com'
      )
      
      if (await sendEmail(student.email, 'Your training is waiting', html)) {
        await supabase.from('ace_email_log').insert({
          enrollment_id: student.enrollment_id,
          email_type: 're_engagement',
          email_address: student.email,
        })
        sent.push(`re_engagement → ${student.email}`)
      }
    }
  }

  // 3. Exam-ready students (mock score > 80% and no flag set)
  const { data: examReady } = await supabase.rpc('get_exam_ready_students')
  
  for (const student of examReady || []) {
    if (student.email && !student.exam_ready_email_sent) {
      const html = brandedEmail(
        'You're ready for the real thing',
        `<p>Your mock exam scores say you're ready to take the CAET Entry-Level exam.</p>
         <p>Here's how to schedule:</p>
         <ol style="color:#e8e8e8;line-height:1.8;">
           <li>Go to <a href="https://www.aea.net/caet" style="color:#4B8BF5;">aea.net/caet</a></li>
           <li>Select "Schedule Exam"</li>
           <li>Choose your testing center</li>
         </ol>
         <p>You've got this.</p>`,
        'Schedule Exam',
        'https://www.aea.net/caet'
      )
      
      if (await sendEmail(student.email, 'Time to schedule your CAET exam', html)) {
        await supabase.from('ace_email_log').insert({
          enrollment_id: student.enrollment_id,
          email_type: 'exam_ready',
          email_address: student.email,
        })
        await supabase
          .from('ace_enrollments')
          .update({ exam_ready_email_sent: true })
          .eq('id', student.enrollment_id)
        sent.push(`exam_ready → ${student.email}`)
      }
    }
  }

  // 4. At-risk students (mock score declining)
  const { data: atRisk } = await supabase.rpc('get_declining_students')
  
  for (const student of atRisk || []) {
    const alreadySent = await supabase
      .from('ace_email_log')
      .select('id')
      .eq('enrollment_id', student.enrollment_id)
      .eq('email_type', 'at_risk')
      .gte('sent_at', new Date(Date.now() - 14 * 86400000).toISOString())
    
    if (!alreadySent.data && student.email) {
      const html = brandedEmail(
        'Let's get you back on track',
        `<p>${student.name || 'Hey'},</p>
         <p>Your scores dipped this week on ${student.weakest_category}. That happens — let's fix it.</p>
         <p>Here's a focused 15-minute drill on ${student.weakest_category}. Master this and you're back in the game.</p>`,
        'Start Drill',
        `https://learn.aceavionicstraining.com/drill?category=${encodeURIComponent(student.weakest_category)}`
      )
      
      if (await sendEmail(student.email, 'Quick drill for you', html)) {
        await supabase.from('ace_email_log').insert({
          enrollment_id: student.enrollment_id,
          email_type: 'at_risk',
          email_address: student.email,
        })
        sent.push(`at_risk → ${student.email}`)
      }
    }
  }

  // 5. Completion nudge (all modules done but no exam scheduled)
  const { data: completionNudge } = await supabase.rpc('get_completion_candidates')
  
  for (const student of completionNudge || []) {
    const alreadySent = await supabase
      .from('ace_email_log')
      .select('id')
      .eq('enrollment_id', student.enrollment_id)
      .eq('email_type', 'completion')
      .single()
    
    if (!alreadySent.data && student.email) {
      const html = brandedEmail(
        'You finished all 8 modules',
        `<p>That's no small thing. You've covered Digital Systems, Analog Circuits, Microprocessors, Navigation, Communication, Instruments, Radar, and Aircraft Systems.</p>
         <p>Now take the real thing. You're ready.</p>`,
        'Schedule Exam',
        'https://www.aea.net/caet'
      )
      
      if (await sendEmail(student.email, 'Time to take the CAET exam', html)) {
        await supabase.from('ace_email_log').insert({
          enrollment_id: student.enrollment_id,
          email_type: 'completion',
          email_address: student.email,
        })
        sent.push(`completion → ${student.email}`)
      }
    }
  }

  return new Response(JSON.stringify({ sent, count: sent.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
