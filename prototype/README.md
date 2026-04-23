# ElectIQ — Your Election Intelligence Assistant

> **Google Hackathon Project** — Interactive Civic Education Platform

ElectIQ is an AI-powered web application that helps citizens understand the election process through interactive timelines, step-by-step guides, a civics quiz engine, and an AI assistant powered by Claude.

---

## 🏆 Why ElectIQ?

Democracy works best when citizens are informed. Yet millions of people don't vote simply because they don't understand the process. ElectIQ solves this by making civic education:

- **Accessible** — Clear, plain-language explanations for everyone
- **Interactive** — Visual timelines, quizzes, and conversational AI
- **Non-partisan** — Strictly factual, process-focused information
- **Comprehensive** — From voter registration to inauguration day

---

## ✨ Features

### 📅 Interactive Election Timeline
- 12-phase visual timeline covering the complete U.S. presidential election lifecycle
- Click-to-expand cards with detailed explanations, key steps, and topic tags
- Phase-coded badges (Pre-Campaign, Primary, General, Post-Election)

### 📋 Step-by-Step Voter Guide
- 8-step comprehensive guide from eligibility check to post-election tracking
- Pro tips, checklists, and actionable links
- Navigate forward/backward through steps
- Leads directly into the quiz

### 🧠 Civics Quiz Engine
- 10 randomized questions covering key election concepts
- Instant feedback with explanations for every answer
- Performance scoring with civic achievement badges
- Encourages deeper exploration after completion

### 🤖 AI Election Assistant (Claude-powered)
- Ask anything about elections, voting rights, or the democratic process
- Non-partisan, factual responses powered by Anthropic Claude
- Pre-loaded suggestion chips for common questions
- Topic tag shortcuts for popular civic questions
- Full conversation context maintained across turns

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- An Anthropic API key (for AI chat feature)

### Running the App

**Option 1: Direct file access**
```bash
# Simply open index.html in your browser
open index.html
```

**Option 2: Local server (recommended)**
```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# Then open: http://localhost:8080
```

### Enabling AI Chat

1. Get your API key from [console.anthropic.com](https://console.anthropic.com)
2. Open `js/chat.js`
3. In the `fetch()` call, add your key to the headers:
   ```javascript
   headers: {
     'Content-Type': 'application/json',
     'anthropic-version': '2023-06-01',
     'anthropic-dangerous-direct-browser-access': 'true',
     'x-api-key': 'YOUR_ANTHROPIC_API_KEY_HERE',
   }
   ```
4. Save and refresh — the AI assistant is now live!

> **Security Note**: For production deployment, proxy API calls through a backend server to keep your API key secure.

---

## 📁 Project Structure

```
election-assistant/
├── index.html              # Main HTML entry point
├── README.md               # This file
├── css/
│   ├── main.css            # Core styles, layout, hero, nav
│   ├── timeline.css        # Timeline component styles
│   ├── chat.css            # Chat + Guide component styles
│   └── quiz.css            # Quiz component styles
├── js/
│   ├── app.js              # Core app: navigation, cursor, keyboard shortcuts
│   ├── timeline.js         # Timeline builder and interaction
│   ├── guide.js            # Voter guide navigation and rendering
│   ├── quiz.js             # Quiz engine: questions, scoring, results
│   └── chat.js             # AI chat interface and Anthropic API integration
└── data/
    └── electionData.js     # All content: timeline phases, guide steps, quiz questions
```

---

## 🎨 Design Philosophy

**Aesthetic: Civic Futurism**

We chose a bold navy + electric cyan palette to evoke both the gravitas of democratic institutions and the optimism of technology-powered civic engagement. The design language borrows from:

- Mission control interfaces (precision, trust, data-forward)
- Modern editorial design (clear hierarchy, generous whitespace)
- Futuristic UI (glows, grid patterns, monospace type accents)

**Typography stack:**
- Display: *Bebas Neue* — authoritative, all-caps, commanding
- Body: *DM Sans* — readable, friendly, modern
- Mono: *JetBrains Mono* — code, badges, data labels

---

## 🛠 Technical Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Vanilla HTML/CSS/JS (zero dependencies) |
| Fonts | Google Fonts (Bebas Neue, DM Sans, JetBrains Mono) |
| AI Backend | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| State Management | In-memory JS objects |
| Animations | CSS keyframes + JS DOM manipulation |

**Design decisions:**
- No build step required — open `index.html` and it works
- Zero npm dependencies — pure web platform APIs
- All data in `electionData.js` — easy to extend/translate
- Modular JS files — each feature is self-contained

---

## 📊 Content Coverage

### Election Timeline (12 phases)
1. Candidate Filing & Exploratory Committees
2. Official Campaign Announcement
3. Party Primaries & Caucuses
4. Super Tuesday
5. National Conventions
6. General Election Campaign
7. Election Day
8. Vote Counting & Certification
9. Electoral College Vote
10. Congressional Certification (January 6)
11. Presidential Transition
12. Inauguration Day

### Voter Guide (8 steps)
1. Check Eligibility
2. Register to Vote
3. Confirm Registration
4. Find Your Polling Place
5. Know Your Voting Options
6. Understand Voter ID Requirements
7. Cast Your Ballot
8. After You Vote

---

## 🌍 Impact & Mission

ElectIQ is designed to increase civic participation by removing the "I don't understand how it works" barrier to voting. Our target users include:

- **First-time voters** — young adults turning 18
- **New citizens** — recently naturalized Americans
- **Returning voters** — people who haven't voted in years
- **Educators** — teachers looking for engaging civics tools
- **Anyone** curious about how democracy works

---

## 🔮 Future Roadmap

- [ ] **State-specific information** — customized guides for all 50 states
- [ ] **Election calendar integration** — real key dates for upcoming elections
- [ ] **Multilingual support** — Spanish, Mandarin, Vietnamese, and more
- [ ] **Accessibility audit** — full WCAG 2.1 AA compliance
- [ ] **Mobile app** — Progressive Web App (PWA) with offline support
- [ ] **Voting record lookup** — verify your registration status
- [ ] **Candidate information** — non-partisan candidate and ballot measure info

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

## 🙏 Acknowledgments

- Election data sourced from USA.gov, FEC.gov, and NCSL.org
- AI responses powered by Anthropic Claude
- Civic design inspired by USA.gov and Vote.gov

---

*Built with ❤️ for democracy. ElectIQ — Making every vote matter.*
