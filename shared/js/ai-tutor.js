/**
 * ACE AI Tutor — AI-powered explanations and study tips
 * Calls Supabase Edge Function which proxies to Claude API
 * Built by Nick Brown for ACE Avionics Training
 */

window.AceTutor = {
  /**
   * Called when student gets a question wrong
   * @param {string} question - The question text
   * @param {string} studentAnswer - What the student selected
   * @param {string} correctAnswer - The correct answer
   * @param {string} category - CAET category (e.g., "Digital Systems")
   * @returns {Promise<string>} The explanation text
   */
  async explain(question, studentAnswer, correctAnswer, category) {
    const bubble = this.createBubble('Thinking...', 'loading');
    document.body.appendChild(bubble);

    try {
      const response = await fetch(`${window.SUPABASE_URL}/functions/v1/ai-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'explain',
          question,
          studentAnswer,
          correctAnswer,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error('AI tutor unavailable');
      }

      const data = await response.json();
      bubble.remove();
      
      const explainBubble = this.createBubble(data.explanation, 'explanation');
      document.body.appendChild(explainBubble);
      
      return data.explanation;
    } catch (err) {
      console.error('AI tutor error:', err);
      bubble.remove();
      
      const fallback = this.createBubble(
        'AI tutor coming soon. For now, review the explanation above and try again.',
        'fallback'
      );
      document.body.appendChild(fallback);
      
      return '';
    }
  },

  /**
   * Called when student asks "why?" on any question
   * @param {string} question - The question text
   * @param {string} correctAnswer - The correct answer
   * @param {string} category - CAET category
   * @returns {Promise<string>} The explanation text
   */
  async askWhy(question, correctAnswer, category) {
    const bubble = this.createBubble('Let me explain...', 'loading');
    document.body.appendChild(bubble);

    try {
      const response = await fetch(`${window.SUPABASE_URL}/functions/v1/ai-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'why',
          question,
          correctAnswer,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error('AI tutor unavailable');
      }

      const data = await response.json();
      bubble.remove();
      
      const whyBubble = this.createBubble(data.explanation, 'explanation');
      document.body.appendChild(whyBubble);
      
      return data.explanation;
    } catch (err) {
      console.error('AI tutor error:', err);
      bubble.remove();
      
      const fallback = this.createBubble(
        'AI tutor coming soon. Check your study materials for more details.',
        'fallback'
      );
      document.body.appendChild(fallback);
      
      return '';
    }
  },

  /**
   * Generate a study tip based on current mastery data
   * @param {object} masteryData - Object with category performance metrics
   * @returns {Promise<string>} The study tip text
   */
  async getStudyTip(masteryData) {
    const bubble = this.createBubble('Analyzing your progress...', 'loading');
    document.body.appendChild(bubble);

    try {
      const response = await fetch(`${window.SUPABASE_URL}/functions/v1/ai-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'study-tip',
          masteryData,
        }),
      });

      if (!response.ok) {
        throw new Error('AI tutor unavailable');
      }

      const data = await response.json();
      bubble.remove();
      
      const tipBubble = this.createBubble(data.explanation, 'tip');
      document.body.appendChild(tipBubble);
      
      return data.explanation;
    } catch (err) {
      console.error('AI tutor error:', err);
      bubble.remove();
      
      const fallback = this.createBubble(
        'Keep practicing! Focus on your weakest categories first.',
        'tip'
      );
      document.body.appendChild(fallback);
      
      return '';
    }
  },

  /**
   * UI helper: create the tutor chat bubble HTML
   * @param {string} text - Message content
   * @param {string} type - 'explanation' (blue), 'tip' (green), 'encouragement' (yellow), 'loading', 'fallback'
   * @returns {HTMLElement} The bubble DOM element
   */
  createBubble(text, type = 'explanation') {
    const bubble = document.createElement('div');
    bubble.className = `ace-tutor-bubble ace-tutor-${type}`;
    
    // Color mapping
    const colors = {
      explanation: 'var(--blue)',
      tip: 'var(--success)',
      encouragement: 'var(--gold)',
      loading: 'var(--text-secondary)',
      fallback: 'var(--text-muted)',
    };
    
    const borderColor = colors[type] || colors.explanation;
    
    bubble.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      max-width: 400px;
      background: var(--surface);
      border: 2px solid ${borderColor};
      border-radius: var(--radius-lg);
      padding: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      z-index: 9999;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      animation: slideIn 0.3s ease-out;
      font-family: var(--font-ui);
      color: var(--text-primary);
      font-size: 14px;
      line-height: 1.5;
    `;
    
    // ACE mascot avatar
    const avatar = document.createElement('img');
    avatar.src = '../../shared/ace-sprites/ace-48-happy.png';
    avatar.alt = 'ACE';
    avatar.style.cssText = `
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      border-radius: 50%;
    `;
    
    // Message text
    const message = document.createElement('div');
    message.style.cssText = 'flex: 1;';
    message.textContent = text;
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      line-height: 24px;
      flex-shrink: 0;
    `;
    closeBtn.onclick = () => bubble.remove();
    
    bubble.appendChild(avatar);
    bubble.appendChild(message);
    bubble.appendChild(closeBtn);
    
    // Auto-dismiss after 8 seconds (except loading)
    if (type !== 'loading') {
      setTimeout(() => {
        bubble.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => bubble.remove(), 300);
      }, 8000);
    }
    
    return bubble;
  },
};

// Add slide animations
if (!document.getElementById('ace-tutor-animations')) {
  const style = document.createElement('style');
  style.id = 'ace-tutor-animations';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
