// supabase/functions/ai-tutor/index.ts
// AI tutor proxy to Claude API for ACE Avionics Training
// Handles: explain, why, study-tip actions

import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.32.1'

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY')!,
})

const SYSTEM_PROMPT = `You are ACE, an avionics training tutor. You explain concepts clearly using real-world avionics examples. Keep explanations under 150 words. Use Socratic method when possible — guide the student to understand WHY, not just WHAT. The student is studying for the CAET (Certified Aircraft Electronics Technician) exam. Be direct, practical, no jargon without explanation.`

Deno.serve(async (req) => {
  try {
    const { action, question, studentAnswer, correctAnswer, category, masteryData } = await req.json()

    let userPrompt = ''

    if (action === 'explain') {
      userPrompt = `Category: ${category}

The student answered "${studentAnswer}" but the correct answer is "${correctAnswer}".

Question: ${question}

Explain why the correct answer is right and why their answer was wrong. Use a real-world analogy if helpful.`
    } else if (action === 'why') {
      userPrompt = `Category: ${category}

Question: ${question}

Correct answer: ${correctAnswer}

Explain the underlying concept and why this answer is correct.`
    } else if (action === 'study-tip') {
      userPrompt = `Based on the student's mastery data:
${JSON.stringify(masteryData, null, 2)}

Give one specific, actionable study tip in 2-3 sentences.`
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const explanation = message.content[0].type === 'text' ? message.content[0].text : ''

    return new Response(JSON.stringify({ explanation }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('AI tutor error:', err)
    return new Response(JSON.stringify({ error: 'AI tutor unavailable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
