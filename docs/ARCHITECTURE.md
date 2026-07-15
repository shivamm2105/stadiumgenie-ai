# StadiumGenie AI — System Architecture Documentation

This document provides a complete technical architecture overview of StadiumGenie AI, a full-stack, AI-powered stadium operations platform built for the FIFA World Cup 2026.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SINGLE DEPLOYMENT URL                            │
│                     (Render Web Service / Localhost)                      │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Express.js Server (Node.js)                     │   │
│  │                                                                    │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │   │
│  │  │  Static Assets  │  │    API Routes   │  │  Health Check   │  │   │
│  │  │  /client/dist   │  │  /api/status    │  │  /health        │  │   │
│  │  │  (React SPA)    │  │  /api/ai        │  │                 │  │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘  │   │
│  │                                │                                   │   │
│  │              ┌─────────────────┼──────────────────────┐           │   │
│  │              ▼                 ▼                      ▼           │   │
│  │  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────┐│   │
│  │  │ statusController│  │ aiController │  │    geminiService.js  ││   │
│  │  │ (in-memory DB)  │  │ (AI routing) │  │ (Gemini 1.5 Flash)   ││   │
│  │  └─────────────────┘  └──────────────┘  └──────────────────────┘│   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              React SPA (Vite build served by Express)             │   │
│  │                                                                    │   │
│  │  ┌──────────────┐  ┌──────────────────┐  ┌───────────────────┐  │   │
│  │  │   Contexts   │  │  Custom Hooks    │  │    Components     │  │   │
│  │  │  (User, Theme│  │  (useUser,       │  │  (Navbar,         │  │   │
│  │  │   Acc, State)│  │   useTheme,      │  │   GlassCard,      │  │   │
│  │  │              │  │   useAccess,     │  │   AccessibilityTB,│  │   │
│  │  │              │  │   useStadium)    │  │   SkeletonLoader) │  │   │
│  │  └──────────────┘  └──────────────────┘  └───────────────────┘  │   │
│  │                                                                    │   │
│  │  ┌───────────────────────────────────────────────────────────┐   │   │
│  │  │                      Pages / Dashboards                    │   │   │
│  │  │   Home.jsx   FanDashboard   OrganizerDashboard             │   │   │
│  │  │              VolunteerDashboard   StaffDashboard            │   │   │
│  │  └───────────────────────────────────────────────────────────┘   │   │
│  │                                                                    │   │
│  │  ┌───────────────────────────────────────────────────────────┐   │   │
│  │  │                       Services                             │   │   │
│  │  │   ApiService (status CRUD + fallback cache)                │   │   │
│  │  │   AiService  (AI calls + client-side fallback)             │   │   │
│  │  └───────────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                         Google Gemini 1.5 Flash
                          (External AI API)
```

---

## Repository Structure

```
stadiumgenie-ai/
│
├── client/                         # React + Vite frontend
│   ├── public/                     # Static public assets
│   ├── src/
│   │   ├── assets/                 # Images and static media
│   │   ├── components/             # Shared UI components
│   │   │   ├── AccessibilityToolbar.jsx   # WCAG accessibility controls
│   │   │   ├── GlassCard.jsx              # Reusable glass morphism card
│   │   │   ├── Navbar.jsx                 # Navigation + emergency alert bar
│   │   │   └── SkeletonLoader.jsx         # Loading skeleton placeholder
│   │   │
│   │   ├── constants/
│   │   │   └── stadiumConstants.js        # Centralized UI preset lists
│   │   │
│   │   ├── context/                # React Context providers
│   │   │   ├── AccessibilityContext.jsx   # Accessibility state + Web Speech API
│   │   │   ├── StadiumStateContext.jsx    # Live stadium data state
│   │   │   ├── ThemeContext.jsx           # Dark/light mode state
│   │   │   └── UserContext.jsx            # Active user role state
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useAccessibility.js        # Accessibility context consumer
│   │   │   ├── useStadiumState.js         # Stadium state context consumer
│   │   │   ├── useTheme.js                # Theme context consumer
│   │   │   └── useUser.js                 # User context consumer
│   │   │
│   │   ├── layouts/                # Application layout wrappers
│   │   ├── pages/                  # Route-level page components
│   │   │   ├── Home.jsx                   # Landing page + role selector
│   │   │   ├── FanDashboard.jsx           # Fan Companion portal
│   │   │   ├── OrganizerDashboard.jsx     # Organizer Command portal
│   │   │   ├── VolunteerDashboard.jsx     # Volunteer Hub portal
│   │   │   └── StaffDashboard.jsx         # Staff Portal
│   │   │
│   │   ├── services/
│   │   │   └── api.js                     # ApiService + AiService (with fallback)
│   │   │
│   │   ├── App.jsx                 # Root application component
│   │   ├── main.jsx                # React DOM entry point
│   │   ├── index.css               # Global styles + CSS design tokens
│   │   └── setupTests.js           # Vitest test configuration
│   │
│   ├── index.html                  # HTML entry point with preconnects
│   ├── vite.config.js              # Vite build config + manual chunks
│   └── vitest.config.js            # Frontend test runner config
│
├── server/                         # Express + Node.js backend
│   ├── config/
│   │   └── geminiConfig.js         # Gemini SDK initialization + mock flag
│   │
│   ├── controllers/
│   │   ├── aiController.js         # AI route handler functions (thin layer)
│   │   └── statusController.js     # Stadium data CRUD handlers
│   │
│   ├── middleware/
│   │   ├── error.js                # Global error handler middleware
│   │   └── validation.js           # express-validator rules for all endpoints
│   │
│   ├── routes/
│   │   ├── aiRoutes.js             # AI endpoint router definitions
│   │   └── statusRoutes.js         # Status/data endpoint router definitions
│   │
│   ├── services/
│   │   └── geminiService.js        # Gemini API calls + mock AI simulators
│   │
│   ├── utils/
│   │   └── mockData.js             # Initial in-memory dataset (FIFA 2026 sim)
│   │
│   ├── __tests__/                  # Backend test suites
│   │   ├── routes.test.js
│   │   ├── controllers.test.js
│   │   └── services.test.js
│   │
│   └── index.js                    # Express server entry point
│
├── docs/                           # Technical documentation
│   ├── ARCHITECTURE.md             # This document
│   ├── AI_ARCHITECTURE.md          # AI module documentation
│   ├── API.md                      # API endpoint reference
│   ├── FEATURE_MAPPING.md          # Feature-to-problem mapping
│   ├── USER_FLOW.md                # User journey documentation
│   ├── PERFORMANCE.md              # Performance optimizations
│   └── SECURITY.md                 # Security measures
│
├── .github/workflows/
│   └── test.yml                    # CI/CD pipeline (GitHub Actions)
│
├── package.json                    # Root monorepo scripts
├── .env.example                    # Environment variable template
├── README.md                       # Project overview and setup guide
├── CHANGELOG.md                    # Version history
├── CONTRIBUTING.md                 # Contribution guidelines
├── SECURITY.md                     # Security policy
└── CODE_OF_CONDUCT.md              # Community standards
```

---

## Frontend Architecture

### Technology Stack
| Layer | Technology |
|---|---|
| Framework | React 18 (with concurrent features) |
| Build Tool | Vite 5 with manual chunk splitting |
| Language | JavaScript (ES2022+, JSX) |
| Styling | Vanilla CSS with custom design tokens |
| Animation | Framer Motion |
| Icons | Lucide React |
| Charting | Recharts |
| Testing | Vitest + React Testing Library |
| Linting | OxLint |
| Font Loading | Google Fonts (Inter, Outfit) with preconnect |

### State Management Architecture
StadiumGenie AI uses React Context API with four independent context providers:

```
App
└── UserProvider (active role: fan | organizer | volunteer | staff)
    └── ThemeProvider (dark | light mode)
        └── AccessibilityProvider (high contrast, large text, dyslexic font, voice)
            └── StadiumStateProvider (live stadium data, fetch on mount)
                └── Router
                    └── Layout
                        ├── Navbar
                        ├── AccessibilityToolbar
                        └── Home (→ active dashboard)
```

### Custom Hooks Layer
Each context is consumed through a dedicated custom hook with error boundary:

```js
// Pattern enforced across all 4 hooks
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
```

This enforces correct usage and provides clear developer error messages.

### Code Splitting Strategy
Dashboard components are lazy-loaded using React's `lazy` + `Suspense`:

```js
const FanDashboard = lazy(() => import('./FanDashboard'));
const OrganizerDashboard = lazy(() => import('./OrganizerDashboard'));
const VolunteerDashboard = lazy(() => import('./VolunteerDashboard'));
const StaffDashboard = lazy(() => import('./StaffDashboard'));
```

Only the active dashboard chunk is downloaded by the browser. Combined with Vite manual chunk splitting (Recharts, Framer Motion, Lucide Icons in separate chunks), initial page load is under 100KB parsed JS.

### Render Optimization
Form inputs in each dashboard are isolated in localized `React.memo` subcomponents:

```
FanDashboard
├── ChatForm (isolated, React.memo)        → Only re-renders when input changes
├── TransitPlannerForm (isolated, memo)    → Only re-renders on its own state
└── [Memoized heatmaps, lists, tables]    → Never re-render on keystrokes
```

This prevents expensive SVG heatmap re-renders and table DOM diffing on every keystroke.

---

## Backend Architecture

### Technology Stack
| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| AI SDK | @google/generative-ai |
| Validation | express-validator |
| Security | Helmet.js, CORS |
| Compression | compression (Gzip/Brotli) |
| Environment | dotenv |
| Testing | Vitest + Supertest |

### Layered Architecture Pattern
```
HTTP Request
     │
     ▼
compression() middleware (Gzip response encoding)
     │
     ▼
helmet() (Security headers: HSTS, XSS, noSniff)
     │
     ▼
cors() (Cross-origin resource sharing)
     │
     ▼
express.json() (Body parsing)
     │
     ▼
express.static(client/dist) (SPA static asset serving)
     │
     ▼
/api/status routes → statusRoutes.js
     │    └─→ express-validator validation chain
     │    └─→ statusController.js (CRUD operations on in-memory state)
     │
/api/ai routes → aiRoutes.js
     │    └─→ express-validator validation chain
     │    └─→ aiController.js (thin handler layer)
     │    └─→ geminiService.js (Gemini API call or mock simulator)
     │
/health → inline handler
     │
/* SPA fallback → serves index.html for all non-API routes
     │
globalErrorHandler (middleware/error.js)
```

### In-Memory Database
The server uses a mutable in-memory state array pattern (simulating a live database):
```js
let gates = [...mockGates];       // Crowd occupancy data
let incidents = [...mockIncidents]; // Safety incidents
let lostAndFound = [...mockLostAndFound]; // Lost property registry
let volunteers = [...mockVolunteers]; // Volunteer directory
let maintenanceTickets = [...];   // Facilities maintenance queue
let volunteerTasks = [...];       // Task assignment queue
```

This design is intentional for the event-scoped nature of stadium operations — data resets on server restart, matching real-world event lifecycle.

---

## API Flow & Request Lifecycle

```
1. Client sends POST /api/ai/incident-summary
   { description: "Fan collapsed...", category: "Medical" }

2. Express compression() → automatic Gzip encoding queued for response

3. helmet() → adds X-Frame-Options, Content-Security-Policy headers

4. aiRoutes.js routes to aiIncidentValidator[] → validateRequest()
   → Validates: description (required, string, escaped), category (required)

5. handleIncidentSummary() controller called with sanitized req.body

6. geminiService.getIncidentSummaryAndResponse(description, category) called

7. If isMockAI → simulateIncidentAnalysis() returns mock JSON object
   If real AI → Gemini 1.5 Flash generates JSON with responseMimeType config

8. JSON.parse(result.response.text()) → typed incident response object

9. res.json({ summaryData: { summary, priority, suggestedActions, staffNeeded } })

10. Response compressed → returned to client in ~200-400ms
```

---

## Deployment Architecture

### Single URL Strategy
Express serves the React production build from `client/dist` as static assets. All non-API routes fall back to `index.html` enabling React Router to handle client-side navigation:

```js
// Static assets from Vite production build
app.use(express.static(path.join(__dirname, '../client/dist')));

// API routes
app.use('/api/status', statusRoutes);
app.use('/api/ai', aiRoutes);

// SPA fallback (all non-API GET requests → React's index.html)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});
```

### Render Deployment
- **Build Command**: `npm run build` (installs client deps + runs `vite build`)
- **Start Command**: `node server/index.js`
- **Environment Variables**: `PORT`, `GEMINI_API_KEY`, `NODE_ENV=production`
- **Service Type**: Web Service (single instance)

### CI/CD Pipeline
GitHub Actions workflow (`.github/workflows/test.yml`) runs on every push:
1. Install all dependencies
2. Run linting (oxlint)
3. Run client test suite (Vitest)
4. Run server test suite (Vitest + Supertest)
5. Build frontend production bundle

---

## Design System

### Color Palette (CSS Custom Properties)
```css
--color-fifa-emerald: #00c875;  /* Primary brand green */
--color-fifa-blue: #3b82f6;     /* Secondary brand blue */
--color-fifa-gold: #fbbf24;     /* Accent gold */
--color-fifa-red: #ef4444;      /* Emergency/danger */
--color-fifa-navy: #0f172a;     /* Dark background */
```

### Typography
- **Display (headings)**: Outfit (Google Fonts, weights 400–900)
- **Body (UI text)**: Inter (Google Fonts, weights 400–700)
- Both fonts preconnected in `index.html` for fastest possible load

### Component Architecture
All shared UI uses GlassCard — a compound component implementing glassmorphism:
```jsx
<GlassCard
  onClick={handler}
  hoverEffect={true}
  ariaLabel="Accessible description"
  className="custom overrides"
>
  {children}
</GlassCard>
```
