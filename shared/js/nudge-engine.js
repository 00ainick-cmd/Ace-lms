// shared/js/nudge-engine.js
// ACE Avionics — Smart Nudge Engine
// Analyzes student state and generates contextual nudges

window.AceNudge = {
  
  /**
   * Main entry point — analyze state and return nudge object
   * @returns {Object} { type: 'info'|'warning'|'success'|'urgent', message: string, action: { text, url } }
   */
  async checkAndDisplay() {
    // Update last login
    const now = new Date().toISOString()
    localStorage.setItem('ace_last_login', now)
    
    // Gather all state
    const lastLogin = this._getLastLogin()
    const examDate = this._getExamDate()
    const diagnosticResults = this._getDiagnosticResults()
    const mockScore = this._getMockScore()
    const modulesComplete = this._getModulesComplete()
    const masteryData = this._getMasteryData()
    const weakCategories = this._getWeakCategories(masteryData)
    
    // Priority order — most urgent first
    
    // 1. First visit ever
    if (!lastLogin) {
      return {
        type: 'info',
        message: 'Welcome to ACE Avionics Training! Start with the 5-minute diagnostic to create your personalized study plan.',
        action: { text: 'Take Diagnostic', url: 'diagnostic.html' }
      }
    }
    
    // 2. Exam in < 7 days (URGENT)
    if (examDate) {
      const daysUntilExam = this._daysUntil(examDate)
      if (daysUntilExam > 0 && daysUntilExam < 7) {
        return {
          type: 'urgent',
          message: `Your exam is in ${daysUntilExam} day${daysUntilExam === 1 ? '' : 's'}! Take a full mock exam to gauge readiness.`,
          action: { text: 'Take Mock Exam', url: 'final-exam.html' }
        }
      }
    }
    
    // 3. Mock score > 80% (ready!)
    if (mockScore && mockScore >= 80) {
      return {
        type: 'success',
        message: `You're scoring ${mockScore}% on practice exams. You're ready! Schedule your exam with confidence.`,
        action: { text: 'View Progress', url: 'progress.html' }
      }
    }
    
    // 4. Mock score < 60% (needs work)
    if (mockScore && mockScore < 60) {
      const top3weak = weakCategories.slice(0, 3).map(c => c.name).join(', ')
      return {
        type: 'warning',
        message: `Your mock score (${mockScore}%) needs work. Focus on: ${top3weak}.`,
        action: { text: 'Study Plan', url: 'study-plan.html' }
      }
    }
    
    // 5. Exam in < 14 days
    if (examDate) {
      const daysUntilExam = this._daysUntil(examDate)
      if (daysUntilExam > 0 && daysUntilExam < 14) {
        const weakest = weakCategories[0]?.name || 'weak areas'
        return {
          type: 'warning',
          message: `Your exam is in ${daysUntilExam} days. Focus on ${weakest} this week.`,
          action: { text: 'Study Plan', url: 'study-plan.html' }
        }
      }
    }
    
    // 6. Completed all modules
    if (modulesComplete >= 8) {
      return {
        type: 'success',
        message: 'All modules complete! Take the mock exam, then schedule the real thing.',
        action: { text: 'Mock Exam', url: 'final-exam.html' }
      }
    }
    
    // 7. No diagnostic taken
    if (!diagnosticResults) {
      return {
        type: 'info',
        message: 'Take the 5-minute diagnostic to get your personalized study plan.',
        action: { text: 'Take Diagnostic', url: 'diagnostic.html' }
      }
    }
    
    // 8. Has diagnostic, no exam date
    if (diagnosticResults && !examDate) {
      return {
        type: 'info',
        message: 'Set your exam date to unlock your personalized study plan.',
        action: { text: 'Set Exam Date', url: 'study-plan.html' }
      }
    }
    
    // 9. Returning after 3+ days
    if (lastLogin) {
      const daysSinceLogin = this._daysSince(lastLogin)
      if (daysSinceLogin >= 3) {
        return {
          type: 'info',
          message: `Welcome back! You've been away ${daysSinceLogin} days. Let's get back on track.`,
          action: { text: 'Continue Learning', url: 'dashboard.html' }
        }
      }
    }
    
    // Default — general encouragement
    const weakest = weakCategories[0]?.name || 'your weak areas'
    return {
      type: 'info',
      message: `Keep building mastery. Focus on ${weakest} today.`,
      action: { text: 'Practice Drills', url: 'hub.html' }
    }
  },
  
  // ── Internal helpers ──────────────────────────────────────────────────
  
  _getLastLogin() {
    const ts = localStorage.getItem('ace_last_login')
    return ts || null
  },
  
  _getExamDate() {
    const date = localStorage.getItem('ace_exam_date')
    return date || null
  },
  
  _getDiagnosticResults() {
    try {
      const raw = localStorage.getItem('ace_diagnostic_results')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  },
  
  _getMockScore() {
    try {
      const raw = localStorage.getItem('ace_mock_score')
      return raw ? parseInt(raw, 10) : null
    } catch { return null }
  },
  
  _getModulesComplete() {
    try {
      const raw = localStorage.getItem('ace_progress')
      if (!raw) return 0
      const progress = JSON.parse(raw)
      return Object.values(progress).filter(p => p >= 100).length
    } catch { return 0 }
  },
  
  _getMasteryData() {
    try {
      const raw = localStorage.getItem('ace_lo_mastery')
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  },
  
  _getWeakCategories(masteryData) {
    // Compute average mastery per module
    const modules = ['mod1', 'mod2', 'mod3', 'mod4', 'mod5', 'mod6', 'mod7', 'mod8']
    const moduleNames = {
      mod1: 'Electronics Fundamentals',
      mod2: 'Aircraft Systems',
      mod3: 'Wiring & Hardware',
      mod4: 'Installation & Repair',
      mod5: 'Test Equipment & Troubleshooting',
      mod6: 'Documentation & Safety',
      mod7: 'Software & Digital Systems',
      mod8: 'Regulations & Standards'
    }
    
    const scores = modules.map(mod => {
      const loKeys = Object.keys(masteryData).filter(k => k.startsWith(mod + '_'))
      if (loKeys.length === 0) return { mod, name: moduleNames[mod], score: 0 }
      const avg = loKeys.reduce((sum, k) => sum + (masteryData[k] || 0), 0) / loKeys.length
      return { mod, name: moduleNames[mod], score: avg }
    })
    
    // Sort by score ascending (weakest first)
    return scores.sort((a, b) => a.score - b.score)
  },
  
  _daysUntil(dateStr) {
    const target = new Date(dateStr)
    const now = new Date()
    const diff = target - now
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  },
  
  _daysSince(dateStr) {
    const past = new Date(dateStr)
    const now = new Date()
    const diff = now - past
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }
}
