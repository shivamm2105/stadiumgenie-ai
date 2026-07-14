# ⚽ StadiumGenie AI

<div align="center">

**One Intelligent AI Platform for Smart Stadium & Tournament Operations**

*Built for the Hack2Skill PromptWars Virtual Challenge 4*
*Theme: Smart Stadiums & Tournament Operations for the FIFA World Cup 2026*

[![React 19](https://img.shields.io/badge/React-19.2.7-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8.1.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Node.js 24](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express 4](https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-green.svg?style=flat-square)](#accessibility)
[![AI-Powered](https://img.shields.io/badge/AI--Powered-Google_Gemini-blue.svg?style=flat-square)](#ai-features)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile_First-orange.svg?style=flat-square)](#responsive-design)

</div>

---

## 📖 Project Overview

### The Real-World Problem
Managing millions of fans during global tournaments like the **FIFA World Cup 2026** poses unprecedented logistics, safety, and communication bottlenecks. 
- **Crowd Congestion**: Ticketing checkpoints and exit gates experience massive crowd surges, resulting in bottlenecks and potential safety hazards.
- **Access Gaps**: Accessibility requirements (e.g., wheelchair pathing) are often obscured, slowing down entry for disabled fans.
- **Language Barriers**: Volunteers struggle to communicate instantly with global attendees coming from diverse linguistic backgrounds.
- **Facilities Repair Lag**: Stadium staff lack an automated prioritization system to log and repair critical scanner freezes, water spills, or turnstile failures before they cause blockages.

### The Solution: StadiumGenie AI
**StadiumGenie AI** acts as a centralized operational dashboard and visitor companion. By linking fans, operations managers, volunteers, and staff under one synchronized data flow, the platform coordinates real-time telemetry updates. It utilizes **Google Gemini AI** to translate statements, triage security incidents, prioritize facility repairs, and deliver personalized transit planning paired with green sustainability guidelines.

---

## 🎯 Problem Statement Alignment

| Focus Area | Solution in StadiumGenie AI |
| :--- | :--- |
| **Stadium Navigation** | Vector SVG pathfinder map showing visual routing lines between seats, gates, concession blocks, and restrooms. |
| **Crowd Management** | Telemetry charts tracking arrival rates, live gate queue alerts, and heatmaps highlighting nw bottlenecks. |
| **Accessibility** | Built-in Screen Reader voice synthesis, High Contrast themes, dyslexia readability spacing, and Gate D ADA route planning. |
| **Transportation** | Transit Route Planner providing estimated time arrivals (ETAs) for Metro, shuttle buses, and rideshares. |
| **Sustainability** | Green Eco-tips computed alongside transit choices to promote zero-emission shuttles and carbon tracking. |
| **Multilingual Assistance** | Real-time translation input bridge converting guest requests instantly to Spanish, French, German, or Arabic. |
| **Operational Intelligence** | In-memory database synchronizing alerts, tickets, and incident dispatches in real-time across four distinct role views. |
| **Real-Time Decision Support** | Organizer emergency broadcaster that flashes warning banners on fan screens, alongside AI incident triage suggestions. |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7 | Modern dynamic interface, CSS-in-JS compiling, robust SPA hash-routing. |
| **Animations** | Framer Motion, Lucide Icons | Responsive micro-animations, premium layout transitions, vector icons. |
| **Data Viz** | Recharts | Analytics charting of entry trends and crowd accumulation metrics. |
| **Backend** | Node.js, Express, Helmet, CORS | Core controller endpoints, security headers, and query proxying. |
| **AI Layer** | `@google/generative-ai` (Gemini API) | Generative LLM logic mapping for chatbots, translation, and triaging. |
| **Failover** | Local Storage Simulation Controllers | Client-side fallback engine to support offline/static preview hostings. |

---

## 🤖 AI Features (Powered by Gemini)

Google Gemini is integrated deeply throughout the system to generate intelligent, context-aware operational advice instead of hardcoded templates:

- **AI Match Assistant**: Conversational agent providing seat locating, gate queue tips, food advice, and emergency information.
- **AI Multilingual Translator**: Translates guest statements into targeted languages and runs pre-programmed safety announcements.
- **AI Incident Analyst**: Analyzes crowd bottlenecks or medical issues to generate a 1-sentence summary, rank threat level, list actions, and request teams.
- **AI Facility prioritizer**: Computes maintenance ticket priority scores (Critical, High, Medium, Low), sets resolution ETAs, and details justifications.
- **AI Eco-Transit Planner**: Establishes transit directions depending on congestion and provides travel advice on lowering carbon footprints.

---

## 🏢 Architecture

```mermaid
graph TD
  A[React 19 Frontend Client] -->|Fetch Requests| B[Express API Backend Server]
  B -->|AI Prompt Proxy| C[Google Gemini API]
  A -->|Direct Fallback Failover| D[Browser Local Storage Simulation]
  B -->|Data Stream| E[In-Memory Operations DB]
```

### Frontend Architecture
- **State Management**: Distributed through React Contexts (`UserContext`, `ThemeContext`, `AccessibilityContext`, `StadiumStateContext`).
- **Telemetry Syncing**: Context polls the backend every 5 seconds, keeping all dashboards updated on emergencies, maintenance logs, and checklists.
- **Dynamic Code-Splitting**: Portal dashboards are code-split using `React.lazy` and `Suspense`, slicing initial load JavaScript from **802.89 kB** to **380.81 kB**.

### Backend Architecture
- **Security Sanitization**: Uses `express-validator` schema rules to sanitize input parameters, trim fields, and escape HTML tags (XSS guard).
- **Graceful Error Triage**: Central error boundary middleware catches promise rejections and serves sanitized error outputs.

---

## 📁 Folder Structure

```text
StadiumGenie AI/
├── client/                     # Frontend Application Folder
│   ├── src/
│   │   ├── components/         # Common UI Components (Navbar, GlassCard, AccessibilityToolbar, SkeletonLoader)
│   │   ├── context/            # Global State Contexts (Theme, User, Accessibility, StadiumState)
│   │   ├── layouts/            # Page Frame Wrappers (MainLayout)
│   │   ├── pages/              # Portal Dashboards (Fan, Organizer, Volunteer, Staff, Home)
│   │   ├── services/           # API and AI Fetch wrappers (Dual-Mode Failover Client)
│   │   ├── main.jsx            # React mounting file
│   │   └── App.jsx             # Routes and context coordinator
│   ├── vite.config.js          # Vite config
│   └── package.json            # Frontend package scripts
├── server/                     # Backend API Folder
│   ├── config/                 # Google Gemini credentials config
│   ├── controllers/            # API Controllers (AI response, operational status)
│   ├── middleware/             # Sanitization validators & error handlers
│   ├── routes/                 # Express routing paths (AI and Status routes)
│   ├── services/               # Gemini AI prompt logic
│   ├── utils/                  # Live telemetry mock database
│   └── index.js                # Server entry point
├── package.json                # Monorepo concurrent script manager
└── .gitignore                  # Git-ignore definitions (caches, keys, node_modules)
```

---

## 📸 Screen Previews

<details>
  <summary>🔍 Click to view Screen Layout Descriptions</summary>

### 1. Home / Portal Switcher
Glassmorphic hub displaying introductory details and four cards corresponding to each portal role (Fan, Organizer, Volunteer, Staff).

### 2. Fan Companion & Interactive Navigator
SVG pathfinder map layout displaying seating indicators in yellow, exit paths in green/blue, live entry wait times, and the AI chatbot.

### 3. Organizer Operations Dashboard
Analytics charts illustrating arrival speed rates, crowd NW heatmap metrics, the incident dispatch center, and the global broadcaster panel.

### 4. Volunteer Translation Hub
Side-by-side view featuring the AI translation input box, target language drop-downs, lost & found logs, and check-off rosters.

### 5. Staff Repair Logger
A ticket form showing inputs for facilities failures, alongside the Gemini priority output card (Priority levels, ETAs, and justifications).

</details>

---

## ⚡ Performance Optimizations

- **Vite Bundler Code-Splitting**: Divides Recharts and heavy frameworks into lazy chunks, ensuring faster first contentful paint (FCP) on mobile browsers.
- **Glassmorphic Skeleton Screen Loaders**: Renders pulsing layout cards during tab switching to preserve visual smoothness.
- **State Telemetry Polling**: Polling cycles are limited to 5 seconds to reduce network load while maintaining real-time telemetry.

---

## ♿ Accessibility (WCAG 2.1 AA AA)

- **Speech Synthesis Guide**: Leverages the browser Web Speech API to read aloud hover labels, helping visually impaired guests.
- **High Contrast Overrides**: Adjusts styling colors and adds bold white boundary borders to all panels.
- **Dyslexia Readable spacing**: Changes font-family, letter-spacing, and word-spacing definitions.
- **Focus Indicators**: Highlights active buttons or forms with prominent gold outline rings.

---

## 🔒 Security

- **Inputs Sanitization**: Every string parameter undergoes character escaping (`express-validator`) on the server to block Cross-Site Scripting (XSS).
- **Credential Protection**: All queries to Google Gemini API are proxied via the Express backend; API keys are never stored on client-side JS bundles.
- **Helmet Headers**: Secure response headers are enforced on the backend server to shield client assets.

---

## 🚀 Installation & Local Running

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone & Configure Environment
Initialize your local environment file:
```bash
cp .env.example .env
```
Paste your **Google Gemini API Key**:
```text
GEMINI_API_KEY=AIzaSy...
```

### 2. Install Project Dependencies
Run this command in the project root directory (installs client, server, and workspace root dependencies):
```bash
npm install
npm run install:all
```

### 3. Run Dev Server
Launch both the frontend client and backend Express server concurrently:
```bash
npm run dev
```
- **React Frontend**: http://localhost:5173
- **Express Backend**: http://localhost:5000

---

## 📤 Deployment Guide

### Frontend Deployment (Vercel)
Vite compiles the static code into the `client/dist` directory.
1. Run `npx vercel` inside the `./client` directory.
2. Vercel automatically detects the Vite config and publishes the distribution folder.

### Backend Deployment (Render/similar)
Ensure that the server configuration file reads the environment variables correctly:
1. Set the root directory to `./server` or configure start commands as `npm start --prefix server`.
2. Configure your environment variable `GEMINI_API_KEY` on your provider's settings console.

---

## 🔮 Future Enhancements

1. **IoT Turnstile Integration**: Hook physical scanners to status endpoints for true crowd entry pacing.
2. **Real-time Map Positioning**: Integrate indoor Wi-Fi triangulation for real-time guest tracking inside the corridors.
3. **Smart Ticketing Sync**: Automatically suggest routes based on tickets uploaded to the Fan Companion.
4. **Multilingual Speech Translation**: Integrate voice recognition tools for hands-free volunteer translation.
5. **Interactive 3D Seating Views**: Implement Three.js views from seating blocks.
6. **Evacuation Pathfinding Simulations**: Run AI agent crowd routing tests to optimize egress routes during lockdowns.
7. **Weather and Rain Telemetry**: Adjust food suggestions depending on temperature and rain levels.
8. **Automated Incident Prioritizer Dispatch**: Auto-assign volunteer tasks based on incident locations.
9. **Accessible Audio Described commentary**: Add live text descriptions for blind fans.
10. **Sustainable Transit Incentives**: Provide virtual loyalty discount badges to fans taking eco-friendly subways.
11. **Rideshare Queue Allocators**: Predict rideshare wait times at Gate D terminals.
12. **Cleaning Roster Optimizers**: Direct cleaners depending on restroom block load sensors.
13. **Vercel Edge Functions Integration**: Migrate API services to serverless edge computing paths.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgements

- **Hack2Skill** and the **PromptWars Virtual Challenge 4** team.
- **Google Gemini AI** for powering the intelligence of this project.
- The **Open Source Community** for modern packages like React, Vite, Tailwind CSS, and Framer Motion.

---

<div align="center">

*Designed to simplify operations, ensure safety, and improve fan engagement during the FIFA World Cup 2026.*

</div>
