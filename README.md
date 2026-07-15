# ⚽ StadiumGenie AI

> **One AI Platform for Every Stakeholder at the FIFA World Cup 2026**

[![CI Tests](https://github.com/shivamm2105/stadiumgenie-ai/actions/workflows/test.yml/badge.svg)](https://github.com/shivamm2105/stadiumgenie-ai/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-emerald?logo=render)](https://stadiumgenie-ai.onrender.com)

**StadiumGenie AI** is a full-stack, production-deployed, AI-powered stadium operations platform built for the **PromptWars Virtual Challenge 4**. It uses Google Gemini 1.5 Flash to address the real-world complexity of managing 78,000+ fans, multilingual volunteers, safety incidents, maintenance dispatch, and crowd logistics — all from a single intelligent web application.

---

## 🎯 Problem Statement

Major international sporting events like the FIFA World Cup 2026 create immense operational challenges:

- **78,000+ fans** need real-time guidance on seating, food, transport, and emergencies
- **Security teams** need instant visibility into crowd density and incident prioritization
- **Volunteers** need translation tools to assist fans from 150+ countries
- **Facilities staff** need intelligent ticket triage to prioritize safety-critical maintenance
- **Traditional systems** are fragmented — each team uses a different tool, creating coordination gaps

**StadiumGenie AI unifies all of these needs into a single, AI-enhanced platform.**

---

## 💡 Solution Overview

StadiumGenie AI provides four role-specific dashboards — Fan, Organizer, Volunteer, and Staff — accessible from a single URL with one-click role switching. Each dashboard is powered by Google Gemini 1.5 Flash for contextual, intelligent responses that adapt to real-time stadium conditions.

---

## ✨ Key Features

### 🏟️ Fan Companion
| Feature | Description |
|---|---|
| **AI Match Assistant** | Conversational Gemini chatbot — answers seating, food, exit, and emergency questions in natural language |
| **Seating Path Navigator** | Step-by-step gate-to-seat directions with ADA accessibility routing via Gate D |
| **Food Queue Intelligence** | AI-recommended concessions based on dietary preference and live crowd density |
| **Transit & Eco Planner** | Gate-load-aware post-match transit routing with FIFA sustainability eco-tips |
| **Emergency SOS** | One-tap emergency reporting that instantly alerts the operations center |

### 🎯 Organizer Command
| Feature | Description |
|---|---|
| **Live Crowd Heatmap** | Real-time SVG visualization of gate occupancy across all 4 entry points |
| **AI Incident Triage** | Gemini analyzes incident reports and returns priority, dispatch checklist, and staff assignment |
| **Emergency Broadcast** | Instant message to all connected users via a stadium-wide red alert banner |
| **Stadium Overview** | Live gate, parking, and food court status dashboard |

### 🤝 Volunteer Hub
| Feature | Description |
|---|---|
| **AI Translator** | Real-time Gemini translation in 6 languages: Spanish, French, German, Arabic, Japanese, Portuguese |
| **Lost & Found Registry** | Digital catalog of found items with category filtering and keyword search |
| **Task Manager** | Assigned task queue with Pending → In Progress → Completed workflow |

### 🔧 Staff Portal
| Feature | Description |
|---|---|
| **AI Maintenance Triage** | Gemini evaluates facility reports and assigns Critical/High/Medium/Low priority + ETA + team |
| **Hardware Telemetry** | Live turnstile, gate, and parking system status overview |
| **Maintenance Queue** | Full ticket queue with AI-generated priority classifications |

---

## 🧠 AI Capabilities

StadiumGenie AI uses **Google Gemini 1.5 Flash** for six distinct AI functions:

| AI Module | Input | AI Output |
|---|---|---|
| **Match Assistant** | Free-form fan question + chat history | Contextual stadium guidance (text) |
| **Translator** | English text + target language | Translated text in 6 languages |
| **Incident Triage** | Incident description + category | JSON: priority, actions, staffNeeded |
| **Maintenance Priority** | Facilities report description | JSON: priority, ETA, team, justification |
| **Food Recommendation** | Dietary preference + crowd density | Personalized concession + route recommendation |
| **Transit Eco Planner** | Destination + transit preference + gate load | Route + estimated time + eco sustainability tip |

### Resilience Strategy
Every AI call implements a **three-tier fallback**:
1. **Gemini API** (real-time AI) → if unavailable →
2. **Server-side mock simulators** (pattern-matching heuristics) → if server unavailable →
3. **Client-side fallback** (browser-side heuristic engine)

The application **never shows a broken state** to users.

---

## 🏗️ Architecture

```
Single URL (Render / Localhost:5000)
│
├── Express Server
│   ├── Serves React SPA from /client/dist (static assets)
│   ├── /api/status  ← Stadium data CRUD (incidents, maintenance, volunteers, etc.)
│   ├── /api/ai      ← Gemini AI proxy endpoints
│   └── /health      ← Server health check
│
└── React SPA (Vite build)
    ├── Context: User | Theme | Accessibility | StadiumState
    ├── Dashboards: Fan | Organizer | Volunteer | Staff (lazy-loaded)
    └── Services: ApiService (with fallback) | AiService (with fallback)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the complete architecture diagram.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework with concurrent features |
| Vite | 5 | Build tool with manual chunk splitting |
| Framer Motion | 11 | Smooth page and element animations |
| Recharts | 2 | Data visualization (crowd charts) |
| Lucide React | Latest | Icon system |
| Vanilla CSS | — | Styling with custom design token system |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime environment |
| Express | 4 | HTTP server framework |
| @google/generative-ai | Latest | Gemini AI SDK |
| express-validator | 7 | Input sanitization and validation |
| Helmet.js | 7 | HTTP security headers |
| compression | 1 | Gzip/Brotli response compression |

### Testing & Quality
| Technology | Purpose |
|---|---|
| Vitest | Unit and integration test runner |
| React Testing Library | React component testing |
| Supertest | Express API endpoint testing |
| OxLint | Fast, zero-config JavaScript linter |

---

## 📁 Project Structure

```
stadiumgenie-ai/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Shared UI (Navbar, GlassCard, AccessibilityToolbar)
│       ├── constants/      # Centralized presets (roles, languages, categories)
│       ├── context/        # React Context providers (User, Theme, Accessibility, Stadium)
│       ├── hooks/          # Custom hooks (useUser, useTheme, useAccessibility, useStadiumState)
│       ├── pages/          # Role dashboards (Fan, Organizer, Volunteer, Staff)
│       └── services/       # ApiService + AiService with fallback logic
│
├── server/                 # Express + Node.js backend
│   ├── config/             # Gemini SDK initialization
│   ├── controllers/        # Route handler functions
│   ├── middleware/         # Validation + error handling
│   ├── routes/             # Express router definitions
│   ├── services/           # Gemini API calls + mock simulators
│   └── utils/              # Mock data (FIFA 2026 simulation)
│
├── docs/                   # Technical documentation
│   ├── ARCHITECTURE.md     # System architecture overview
│   ├── AI_ARCHITECTURE.md  # AI module documentation
│   ├── API.md              # Complete API reference
│   ├── FEATURE_MAPPING.md  # Feature-to-problem mapping
│   ├── USER_FLOW.md        # User journey documentation
│   ├── PERFORMANCE.md      # Performance optimizations
│   └── SECURITY.md         # Security measures
│
├── .github/workflows/      # GitHub Actions CI pipeline
├── CHANGELOG.md            # Version history
├── CONTRIBUTING.md         # Development contribution guide
├── CODE_OF_CONDUCT.md      # Community standards
├── SECURITY.md             # Security policy
├── LICENSE                 # MIT license
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Google Gemini API Key** — [Get one free at Google AI Studio](https://aistudio.google.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shivamm2105/stadiumgenie-ai.git
cd stadiumgenie-ai

# 2. Install all dependencies (client + server)
npm run install:all
```

### Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

> **Tip**: Set `GEMINI_API_KEY=mock` to run the application without a real Gemini key. All AI features will use intelligent local simulators.

### Running Locally

```bash
# Start both frontend (Vite dev) and backend (Express) simultaneously
npm run dev

# Or start separately:
npm run dev:client    # Frontend at http://localhost:5173
npm run dev:server    # Backend at http://localhost:5000
```

### Running Tests

```bash
# All tests (client + server)
npm test

# Client tests only
npm run test --prefix client

# Server tests only
npm run test --prefix server

# Coverage report
npm run test:coverage
```

### Production Build

```bash
# Build the React frontend and prepare for Express serving
npm run build

# Start production server (serves React + API from one URL)
npm start
```

---

## 🌍 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | Optional | Express server port (default: 5000) |
| `GEMINI_API_KEY` | **Required** | Google Gemini API key from [AI Studio](https://aistudio.google.com/). Set to `mock` for offline mode. |
| `NODE_ENV` | Optional | `development` or `production` (affects error verbosity) |

---

## 🧪 Testing

StadiumGenie AI has a comprehensive test suite with **74 tests across client and server**:

### Coverage Summary
| Area | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| **Server** | 97.95% | 91.07% | 95.45% | 97.87% |
| **Client** | 96.36% | 86.16% | 96.66% | 97.94% |

### Test Breakdown
- **31 client tests** — Navbar, AccessibilityToolbar, GlassCard, SkeletonLoader, all 4 dashboards, custom hooks
- **43 server tests** — All 14 API endpoints, all controllers, Gemini service mock simulation

---

## ☁️ Deployment (Render)

StadiumGenie AI is deployed as a **single Web Service** on Render.

| Setting | Value |
|---|---|
| **Build Command** | `npm run build` |
| **Start Command** | `node server/index.js` |
| **Node Version** | 18 |

### Required Environment Variables on Render
- `GEMINI_API_KEY` — Your Google Gemini API key
- `NODE_ENV` — `production`

The Express server automatically serves the React production build from `client/dist` and handles SPA routing for React Router.

---

## ⚡ Performance

| Optimization | Impact |
|---|---|
| React.memo form state isolation | Prevents expensive SVG re-renders on keystrokes |
| useMemo filtered list memoization | Eliminates redundant array computation |
| Client-side GET caching (1s TTL) | Prevents duplicate network requests on mount |
| In-flight request deduplication | Concurrent identical calls share one Promise |
| AI response session caching | Repeat questions return instantly |
| Server Gzip/Brotli compression | ~75% payload size reduction |
| Vite manual chunk splitting | Long-term browser caching of vendor libraries |
| React.lazy + Suspense | Dashboard chunks load on demand only |
| Google Fonts preconnect | ~200–400ms font load latency reduction |

See [docs/PERFORMANCE.md](docs/PERFORMANCE.md) for full details.

---

## ♿ Accessibility

StadiumGenie AI targets **WCAG 2.2 AAA** compliance:

- **Lighthouse Accessibility Score: 95–100**
- High contrast mode toggle (CSS class-based)
- Large text scaling (120% root font size)
- Dyslexia-friendly font mode (Comic Sans + increased letter/word spacing)
- Voice assistance via Web Speech API (hover narration of all elements)
- ARIA labels on all interactive elements
- Keyboard navigation throughout the application
- Screen reader compatible semantic HTML structure
- `aria-live="assertive"` emergency alert region for dynamic announcements

---

## 🔒 Security

| Measure | Implementation |
|---|---|
| HTTP security headers | Helmet.js (XSS, clickjacking, MIME sniffing protection) |
| Input sanitization | express-validator `.trim().escape()` on all user inputs |
| Enum whitelisting | Language, priority, transit mode — strict allowlists only |
| API key isolation | Gemini key server-side only, never in client bundle |
| Error sanitization | Stack traces stripped in production mode |
| No PII | No accounts, no cookies, no tracking, no sensitive storage |

See [docs/SECURITY.md](docs/SECURITY.md) for full details and future enhancements.

---

## 🗺️ Future Scope

- **JWT Authentication** — Role-verified access for organizer and staff endpoints
- **WebSocket Real-time Updates** — Live crowd heatmap updates pushed from server without polling
- **Database Integration** — PostgreSQL backend for persistent incident and task history
- **Rate Limiting** — Per-IP Gemini API call throttling to prevent quota exhaustion
- **Push Notifications** — Browser push notifications for emergency alerts even when app is backgrounded
- **Crowd Simulation** — Live WebSocket-driven gate occupancy changes during match events
- **Multi-venue Support** — Scale to multiple FIFA 2026 host stadiums
- **Analytics Dashboard** — Historical incident, maintenance, and crowd flow reporting

---

## 📸 Screenshots

| Home Page — Role Selector |
|---|
| Four role portal cards with live system telemetry counter |

| Fan Companion — AI Match Assistant |
|---|
| Conversational Gemini chatbot with chat history |

| Organizer Command — Crowd Heatmap + Incident Triage |
|---|
| SVG heatmap + AI-powered emergency dispatch system |

| Volunteer Hub — AI Translator |
|---|
| 6-language real-time Gemini translation |

| Staff Portal — AI Maintenance Priority |
|---|
| AI-classified maintenance tickets with Critical/High/Medium/Low priorities |

---

## 🔗 Links

- **Live Demo**: [https://stadiumgenie-ai.onrender.com](https://stadiumgenie-ai.onrender.com)
- **GitHub Repository**: [https://github.com/shivamm2105/stadiumgenie-ai](https://github.com/shivamm2105/stadiumgenie-ai)
- **PromptWars Challenge**: Hack2Skill PromptWars Virtual Challenge 4

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Shivam** — Built for the Hack2Skill PromptWars Virtual Challenge 4

*Powered by Google Gemini AI · Built with React + Vite + Express*

---

## 📚 Documentation

| Document | Description |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Complete system architecture |
| [docs/AI_ARCHITECTURE.md](docs/AI_ARCHITECTURE.md) | AI module documentation |
| [docs/API.md](docs/API.md) | Full API reference |
| [docs/FEATURE_MAPPING.md](docs/FEATURE_MAPPING.md) | Feature-to-problem mapping |
| [docs/USER_FLOW.md](docs/USER_FLOW.md) | User journey documentation |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md) | Performance optimizations |
| [docs/SECURITY.md](docs/SECURITY.md) | Security measures |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guide |
