# ACE Learning Management System

AI-enhanced certification training platform for the CAET (Certified Aircraft Electronics Technician) exam.

Built by Nick Brown. Air Force veteran. Master's in CTE.

## What This Is

Not another click-next course platform. This is an intelligent training system that knows where each student is, what they're weak on, and what they need to do next.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    STUDENT APP                       │
│  Dashboard → Modules → Drills → Mock Exam → Cert    │
│                                                      │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │Onboard  │ │Diagnostic│ │Study Plan│ │AI Tutor │ │
│  │Military │ │24-Q Diag │ │Week by   │ │Claude   │ │
│  │Crosswalk│ │Per-Cat   │ │Week      │ │Socratic │ │
│  └─────────┘ └──────────┘ └──────────┘ └─────────┘ │
├─────────────────────────────────────────────────────┤
│                  INTELLIGENCE LAYER                  │
│  ┌──────────┐ ┌───────────┐ ┌────────────────────┐  │
│  │LO Mastery│ │Nudge      │ │Readiness           │  │
│  │Tracker   │ │Engine     │ │Predictor           │  │
│  │per-LO    │ │10 trigger │ │Weighted by CAET    │  │
│  │accuracy  │ │conditions │ │category weights    │  │
│  └──────────┘ └───────────┘ └────────────────────┘  │
├─────────────────────────────────────────────────────┤
│                    DATA LAYER                        │
│  Supabase: enrollments, question_events, lo_mastery, │
│  progress, completions, session_summaries, email_log │
├─────────────────────────────────────────────────────┤
│                   BUSINESS LAYER                     │
│  Stripe Checkout → Webhook → Enrollment → Email     │
│  Admin Dashboard → Revenue + Students + Engagement  │
├─────────────────────────────────────────────────────┤
│                    EMAIL ENGINE                      │
│  Welcome │ Re-engage │ Exam-ready │ At-risk │ Upsell │
│  Resend API │ Cron-triggered │ Cooldown tracking    │
└─────────────────────────────────────────────────────┘
```

## 5 Levels of Intelligence (Agentic Education Model)

### Level 1: Friction Reduction ✅
Student pays → gets access code via email → logs in → starts training. No forms, no approvals, no "contact us."

### Level 2: Search & Discovery ✅
- Onboarding intake: background, military MOS/AFSC, timeline
- 24-question diagnostic identifies weak categories
- Military crosswalk: "As a former 2A373, you're probably strong on electrical but weak on FARs"
- System routes student to their weakest module first

### Level 3: Memory & Continuity ✅
- Per-learning-objective mastery tracking (not_started → learning → proficient → mastered)
- Smart dashboard: "Welcome back. You've been away 12 days. Your weakest area is still CNS Systems."
- Exam countdown: "Your exam is in 23 days. You're at 74% readiness."
- 6 Supabase tables tracking every question attempt, every mastery level, every session

### Level 4: Planning Partner ✅
- Study plan generator: set exam date → get week-by-week plan
- Weighted by CAET category distribution (mod2 heaviest at 13/60)
- Categories below 60% get 3x study time, 60-79% get 2x, 80%+ maintenance
- Readiness predictor: "Predicted exam score: 78%. Focus on databus to hit 85%."

### Level 5: Anticipatory ✅
- 10-condition nudge engine (client-side)
- Email triggers: inactive 5+ days, mock score >80%, score declining, all modules complete
- Upsell automation: Entry complete → Advanced prep pitch
- Cooldown tracking prevents spam

## Products

| Product | Price | Audience |
|---------|-------|----------|
| CAET Entry Prep | $347 lifetime | New techs, military transition, career changers |
| AET Gap Prep | $97 lifetime | Existing NCATT AET holders upgrading to CAET |
| CAET Advanced Prep | $1,497+ | Certified CAET holders (written + practical + oral) |

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS, dark theme, mobile-first
- **Backend:** Supabase (auth, database, edge functions)
- **AI:** Claude API via Supabase Edge Functions (Socratic tutoring)
- **Payments:** Stripe Checkout + Webhooks
- **Email:** Resend (transactional + nudge campaigns)
- **Hosting:** Netlify or AWS S3 + CloudFront
- **Content:** 233 questions, 8 modules, 7 study modes, 70 journey nodes, 11 RISE modules

## Directory Structure

```
ace-lms/
├── index.html              # LMS landing / demo page
├── admin.html              # Admin dashboard (password protected)
├── onboarding.html         # Student onboarding (intake + diagnostic)
├── study-plan.html         # AI-generated study plan
├── shared/
│   ├── ace-theme.css       # Design system
│   ├── js/
│   │   ├── ace-auth.js     # Enrollment auth system
│   │   ├── ai-tutor.js     # Claude-powered tutoring
│   │   ├── nudge-engine.js # Smart nudge conditions
│   │   ├── lo-mastery-tracker.js  # Per-LO mastery tracking
│   │   ├── ace-gamification.js    # XP, streaks, grades
│   │   └── email-triggers.json    # Nudge configuration
│   └── data/
│       ├── master-bank.json       # 233 questions
│       └── military-crosswalk.json # MOS/AFSC mappings
├── supabase/
│   └── functions/
│       ├── ai-tutor/       # Claude API proxy
│       ├── send-nudge/     # Cron email engine
│       └── stripe-webhook/ # Payment → enrollment
└── README.md
```

## License

Proprietary. © 2026 ACE Avionics Training.
