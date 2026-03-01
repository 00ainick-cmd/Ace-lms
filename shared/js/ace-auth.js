// shared/js/ace-auth.js
// ACE Avionics — Enrollment Auth
// Validates access codes, manages session, gates all pages

const SUPABASE_URL      = 'https://gwxgnlasxzpbipcdavcd.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3eGdubGFzeHpwYmlwY2RhdmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4ODAyNDIsImV4cCI6MjA4NzQ1NjI0Mn0.cjTXz8OLtX4Yt6CX2Sx3n0GXwbrHqS_uH-mK5PivKTk'

const LS_KEY = 'ace_enrollment'  // stores { id, name, plan, expires_at, code }

const _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

window.AceAuth = {

  // ── Get stored session (null if none or expired) ───────────────────────
  async getSession() {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    let session
    try { session = JSON.parse(raw) } catch { return null }

    // Check expiry client-side first (fast)
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      localStorage.removeItem(LS_KEY)
      return null
    }
    return session
  },

  // ── Validate code + activate enrollment ───────────────────────────────
  async activate(code, name) {
    const { data, error } = await _db
      .from('ace_enrollments')
      .select('id, plan, expires_at, is_active, activated_at, student_name')
      .eq('access_code', code.toUpperCase())
      .single()

    if (error || !data) return { success: false, error: 'Access code not found. Check your email and try again.' }
    if (!data.is_active)  return { success: false, error: 'This access code has been deactivated. Contact support.' }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { success: false, error: 'Your access has expired. Purchase a renewal to continue.' }
    }

    // First activation — save name + activated_at
    if (!data.activated_at) {
      await _db.from('ace_enrollments').update({
        student_name: name,
        activated_at: new Date().toISOString()
      }).eq('id', data.id)
    }

    // Store session locally
    const session = {
      id:         data.id,
      name:       name || data.student_name || 'Student',
      plan:       data.plan,
      expires_at: data.expires_at,
      code:       code.toUpperCase()
    }
    localStorage.setItem(LS_KEY, JSON.stringify(session))
    return { success: true, session }
  },

  // ── Require valid enrollment — redirect to enrollment.html if not ──────
  // Call this at the top of every protected page.
  // Usage: const session = await AceAuth.require()
  async require() {
    const session = await this.getSession()
    if (!session) {
      // Preserve the current page so we can return after enrollment
      const returnTo = encodeURIComponent(window.location.pathname + window.location.search)
      window.location.href = `/enrollment.html?return=${returnTo}`
      return null  // page will redirect, never reaches further code
    }
    return session
  },

  // ── Sign out ───────────────────────────────────────────────────────────
  signOut() {
    localStorage.removeItem(LS_KEY)
    window.location.href = 'enrollment.html'
  },

  // ── Get the Supabase client (for use by ace-sync.js) ──────────────────
  getDB() { return _db },

  // ── Get just the enrollment ID (for DB writes) ────────────────────────
  async getEnrollmentId() {
    const session = await this.getSession()
    return session?.id ?? null
  }
}
