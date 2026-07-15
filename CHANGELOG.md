# Changelog

All notable changes to StadiumGenie AI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-07-14

### Added

#### Core Platform
- Four role-based dashboard portals: Fan Companion, Organizer Command, Volunteer Hub, Staff Portal
- Single-page application architecture with React 18 and Vite 5
- Role-switching via Navbar dropdown and Home portal cards
- Dark/light theme toggle with localStorage persistence
- Glassmorphism UI design system with custom CSS design tokens

#### Fan Companion Dashboard
- AI Match Assistant chatbot powered by Google Gemini 1.5 Flash
  - Multi-turn conversational memory via chat history
  - Contextual responses for seating, food, exits, and emergencies
  - Offline fallback heuristic engine
- Seating Path Navigator with gate-to-section step-by-step directions
  - Accessibility-specific routing via Gate D (ADA)
- Food Queue Intelligence with AI-personalized dining recommendations
  - Dietary preference filtering (Vegan, Gluten-Free, Carnivore, None)
  - Crowd density and gate occupancy context-aware routing
- Transit & Eco Planner with gate-load-aware post-match routing
  - Metro, Bus, and Rideshare options with estimated travel times
  - FIFA sustainability eco-tips for each recommendation
- Emergency SOS Button that logs a Medical incident to the operations center

#### Organizer Command Dashboard
- Live stadium status overview (Gates, Parking, Food Courts)
- SVG crowd density heatmap with color-coded gate occupancy levels
- Active Incidents triage table with AI analysis capability
  - AI returns priority level, summary, suggested actions, and staff assignment
  - One-click "Apply AI Response" to update incident records
- Emergency Broadcast Console
  - Triggers real-time alert banner visible to all connected users
  - One-click broadcast clear

#### Volunteer Hub Dashboard
- AI Multilingual Translator (6 languages: Spanish, French, German, Arabic, Japanese, Portuguese)
  - Powered by Gemini 1.5 Flash with culturally appropriate phrasing
- Lost & Found Digital Registry
  - Register found items with category, description, and location
  - Filter and search by category, status, and keyword
- Volunteer Task Management
  - View assigned tasks with status tracking (Pending → In Progress → Completed)
  - Real-time status updates synced to backend

#### Staff Portal Dashboard
- Hardware Telemetry Panel with gate and turnstile status overview
- Maintenance Ticket Queue with priority classification and team assignment
- AI Priority Analyzer — submits descriptions, Gemini returns Critical/High/Medium/Low + ETA
- Parking Status Overview with occupancy percentages across 4 lots

#### Backend API
- `GET /api/status` — Full stadium state endpoint
- `POST /api/status/incident` — Report safety incidents
- `PUT /api/status/incident/:id` — Update incident status/priority/AI response
- `POST /api/status/lost-and-found` — Register found items
- `POST /api/status/maintenance` — Submit maintenance tickets
- `PUT /api/status/task/:id` — Update volunteer task status
- `POST /api/status/emergency` — Trigger/clear emergency broadcasts
- `POST /api/ai/match-assistant` — Fan chatbot AI endpoint
- `POST /api/ai/translate` — Translation AI endpoint
- `POST /api/ai/incident-summary` — Emergency triage AI endpoint
- `POST /api/ai/priority` — Maintenance prioritization AI endpoint
- `POST /api/ai/food-recommendation` — Dining AI endpoint
- `POST /api/ai/transit-eco` — Transit routing AI endpoint
- `GET /health` — Server health check

#### Accessibility (WCAG 2.2 AAA)
- Floating AccessibilityToolbar with: High Contrast, Large Text, Dyslexic Font, Voice Assistance
- Web Speech API integration for hover narration of all UI elements
- ARIA labels on all interactive elements
- Keyboard navigation support throughout the application
- Screen reader compatible semantic HTML structure

#### Security
- Helmet.js HTTP security headers
- express-validator input sanitization on all API endpoints
- HTML escaping (.escape()) on all user-supplied string inputs
- Enum whitelisting for constrained fields
- Server-side API key isolation (Gemini key never exposed to client)
- Production error sanitization (no stack traces in error responses)

#### Performance
- React.memo form state isolation (prevents SVG/table re-renders on keystrokes)
- useMemo filtered list memoization
- useCallback event handler memoization
- Client-side GET response caching (1-second TTL)
- In-flight request deduplication via Promise sharing
- AI response session-level caching
- Server Gzip/Brotli compression via compression middleware
- Vite manual chunk splitting (React, Recharts, Framer Motion, Lucide Icons)
- Dashboard lazy loading via React.lazy + Suspense
- Google Fonts preconnect + preload hints

#### Testing
- 31 frontend tests (Vitest + React Testing Library)
  - Component tests: Navbar, AccessibilityToolbar, GlassCard, SkeletonLoader
  - Dashboard integration tests: all four role portals
  - Hook tests: custom hook error boundary enforcement
- 43 backend tests (Vitest + Supertest)
  - Route tests for all 14 API endpoints
  - Controller unit tests for all handlers
  - Service tests for geminiService mock simulation
- GitHub Actions CI pipeline (test.yml)

#### Documentation
- `README.md` — Complete project overview and setup guide
- `docs/ARCHITECTURE.md` — System architecture documentation
- `docs/AI_ARCHITECTURE.md` — AI module and prompt engineering documentation
- `docs/API.md` — Full API reference with request/response schemas
- `docs/FEATURE_MAPPING.md` — Feature-to-problem mapping document
- `docs/USER_FLOW.md` — User journey documentation for all four roles
- `docs/PERFORMANCE.md` — Performance optimization documentation
- `docs/SECURITY.md` — Security architecture and measures
- `SECURITY.md` — GitHub security policy
- `CONTRIBUTING.md` — Development contribution guide
- `CODE_OF_CONDUCT.md` — Community standards
- `CHANGELOG.md` — Version history (this file)
- `LICENSE` — MIT license

#### Deployment
- Single-URL production deployment configured for Render
- Express serves React production build from `client/dist`
- SPA fallback routing for React Router compatibility
- `npm run build` script for automated Vite build on Render

---

## [0.9.0] — 2026-07-12 (Pre-release)

### Added
- Initial monorepo structure with client and server workspaces
- Core React component library (GlassCard, Navbar, SkeletonLoader)
- Initial Gemini API integration for Match Assistant and Translator
- Basic Express API with status and AI routes
- Initial accessible UI with dark/light mode support

### Changed
- Migrated from separate frontend/backend URLs to single Express-served SPA
- Refactored context exports to separate providers and hooks (Fast Refresh fix)

---

*This changelog covers the complete development history for the PromptWars Virtual Challenge 4 submission.*
