# StadiumGenie AI — User Flow Documentation

This document outlines the complete user journeys through StadiumGenie AI for all four primary user types. Each flow represents a realistic operational scenario during the FIFA World Cup 2026.

---

## Platform Entry Flow

```
User visits StadiumGenie AI URL
          │
          ▼
    Home Page Loads
    (Role Portal Selector)
          │
    ┌─────┴─────────────────────────────────────┐
    │                                            │
    ▼                                            ▼
Select Role via                         Select Role via
Navbar Dropdown                         Portal Card Click
    │                                            │
    └──────────────────┬──────────────────────── ┘
                       ▼
            Dashboard Activates
         (lazy-loaded, animated)
                       │
          ┌────────────┼────────────┬──────────────┐
          ▼            ▼            ▼               ▼
    Fan Companion  Organizer    Volunteer        Staff
                   Command       Hub            Portal
```

---

## Flow 1: Fan Companion — Typical Match Day Journey

**Persona**: Maria, a first-time FIFA World Cup 2026 fan from Brazil visiting MetLife Stadium.

```
1. ARRIVE AT STADIUM
   Maria opens StadiumGenie AI on her phone
          │
          ▼
2. SELECT ROLE
   Selects "Fan Companion" portal card
   → FanDashboard loads with match info (Mexico vs USA, kickoff in 45 mins)
          │
          ▼
3. FIND SEAT — SEATING PATH NAVIGATOR
   Maria sees the "Seat Path Navigator" section
   Selects Gate C (her entry gate) → Section 108 (her seat section)
   → Step-by-step directions displayed:
     "Enter Gate C → Turn left at North Concourse → Section 108 is on Level 1, Row M"
   → ADA alternative path shown: Gate D wheelchair ramp option
          │
          ▼
4. ASK A QUESTION — AI MATCH ASSISTANT
   Maria types: "Where can I find Portuguese food?"
   → Gemini Match Assistant responds with nearby concession options
   → Chat history maintained for contextual follow-up questions
          │
          ▼
5. ORDER FOOD — FOOD QUEUE INTELLIGENCE
   Maria selects dietary preference: "None"
   Clicks "Get AI Food Plan"
   → Gemini recommends Alamo Tacos (FC-1), estimated 12-min wait
   → Route suggestion: "Enter via inner East Corridor"
          │
          ▼
6. HALFTIME — TRANSIT PLANNING
   Maria wants to visit the city center after the match
   Opens "Transit & Eco Planner"
   Types destination: "Midtown Manhattan"
   Selects preference: "Metro"
   → Gemini responds: "Take Metro Line 2 from Gate B (22 min). Sustainability tip: reduces carbon by 85% vs rideshare"
          │
          ▼
7. EMERGENCY — SOS SYSTEM
   [If needed] Maria witnesses a medical situation
   Presses the RED "SOS" button
   → Incident reported to system with "Medical/SOS" category
   → Appears immediately in Organizer Triage Queue
          │
          ▼
8. MATCH END — EXIT GUIDANCE
   Maria asks assistant: "Which gate should I use to exit?"
   → Assistant responds: "Gate A is 90% full. Use Gate B (35%) for fastest exit"
```

---

## Flow 2: Organizer Command — Event Coordination Journey

**Persona**: Alex, Senior Event Coordinator at MetLife Stadium for Mexico vs USA.

```
1. PRE-MATCH SETUP
   Alex opens StadiumGenie AI → Selects "Organizer Command"
   → OrganizerDashboard loads with real-time status data
          │
          ▼
2. MONITOR CROWD — GATE HEATMAP
   Alex views the SVG crowd density heatmap showing all 4 gates
   Gate A: 90% — CRITICAL (red)
   Gate B: 35% — Normal (green)
   Gate C: 60% — Moderate (amber)
   Gate D: 15% — Normal (green)
          │
          ▼
3. REDIRECT CROWD — EMERGENCY BROADCAST
   Alex sees Gate A is critically overloaded
   Types broadcast message: "Gate A is at capacity. Fans entering from north parking, please use Gate B"
   Clicks "Send Broadcast"
   → Pulsing red emergency banner appears on ALL connected users' screens simultaneously
          │
          ▼
4. INCIDENT REPORTED — AI TRIAGE
   Volunteer reports: "Elderly fan collapsed near Gate A ticketing"
   Alex sees incident INC-102 in the Active Incidents list
   Clicks "Analyze with AI" on the incident
   → Gemini returns:
     - Priority: HIGH
     - Summary: "Medical emergency requiring swift first-aid arrival"
     - Suggested Actions:
       1. Dispatch nearest mobile first-aid volunteer with stretcher
       2. Clear accessibility path for paramedic vehicle
       3. Inform regional control booth supervisor
     - Staff Needed: Gate A Medical Responders + Volunteer Escort
   Alex clicks "Apply AI Response" — incident updated with AI-generated response plan
          │
          ▼
5. RESOLVE INCIDENT
   Medical team responds, fan stabilized
   Alex clicks "Resolve Incident" — INC-102 status changes to Resolved
          │
          ▼
6. CLEAR BROADCAST
   Alex clears the emergency broadcast when Gate A returns to normal
   → Red alert banner disappears from all user screens
```

---

## Flow 3: Volunteer Hub — Multilingual Assistance Journey

**Persona**: Carlos Gomez, bilingual volunteer stationed at Gate A Info Desk.

```
1. START SHIFT
   Carlos opens StadiumGenie AI → Selects "Volunteer Hub"
   → VolunteerDashboard loads showing his task list and volunteer directory
          │
          ▼
2. CHECK TASK LIST
   Carlos sees his assigned tasks:
   - T-01: "Assist wheelchair users at Gate D" (Completed)
   - T-02: "Language assistance at Gate A ticketing booth" (In Progress)  ← His current task
   - T-03: "Collect lost passport report near Gate C" (Pending)
   Carlos updates T-01 status from "Pending" to "In Progress" using the status dropdown
          │
          ▼
3. ASSIST INTERNATIONAL FAN — AI TRANSLATOR
   A fan who speaks only French approaches Carlos's info desk
   Carlos opens the Translation module
   Types in English: "Gate A is currently full. Please enter through Gate B."
   Selects language: French
   Clicks Translate
   → Gemini responds: "La porte A est actuellement pleine. Veuillez entrer par la porte B."
   Carlos shows the French text to the fan on his phone screen
          │
          ▼
4. REGISTER FOUND ITEM — LOST & FOUND
   A fan turns in a lost iPhone at the info desk
   Carlos opens the Lost & Found tab
   Fills in:
     Item: "iPhone 15 Pro Max"
     Description: "Blue titanium case, lock screen shows a dog"
     Category: Electronics
     Location Found: Gate A Info Desk
   Clicks "Log Found Item"
   → Item registered as LF-04, immediately searchable
          │
          ▼
5. SEARCH LOST & FOUND
   Another fan asks if anyone found their wallet
   Carlos uses the search/filter feature
   Filters by Category: "Wallet/ID"
   → LF-01 (Black leather wallet, Section 104) appears
   → Carlos contacts the finding volunteer to arrange return
          │
          ▼
6. COMPLETE TASK
   Carlos marks T-02 "Language assistance" as Completed
   → Task status updated via API
```

---

## Flow 4: Staff Portal — Facilities Management Journey

**Persona**: Sarah Chen, Facilities Coordinator responsible for hardware and maintenance at Gate A.

```
1. START MONITORING
   Sarah opens StadiumGenie AI → Selects "Staff Portal"
   → StaffDashboard loads with hardware status, maintenance tickets, and parking overview
          │
          ▼
2. HARDWARE ALERT — TELEMETRY PANEL
   Sarah sees MNT-201 in active tickets:
   "Turnstile A3 ticketing scanner frozen. Rejecting tickets."
   Status: Critical | Team: IT Operations | ETA: 10 mins
          │
          ▼
3. REPORT NEW ISSUE — MAINTENANCE TICKET SUBMISSION
   Sarah finds a broken glass hazard near Concession Stand 3
   Opens the "Report Maintenance Issue" form
   Fills in:
     Details: "Broken glass in front of concession Stand 3"
     Location: "Concourse Section 102"
   Clicks "Analyze Priority with AI"
   → Gemini AI response:
     - Priority: HIGH
     - ETA: 15 minutes
     - Allocated Team: Cleaning Crew
     - Justification: "High hazard of cuts or slips in high-density walking aisle"
   Sarah clicks "Submit Ticket" — MNT-203 created and dispatched
          │
          ▼
4. PARKING OVERVIEW
   Sarah checks the Parking Status panel:
   Parking B is 95% Full, Parking C is 100% Full
   → Shares info with traffic management team to redirect incoming vehicles to Parking D (22% full)
          │
          ▼
5. TICKET RESOLUTION
   IT Operations team fixes Turnstile A3
   Sarah sees crowd at Gate A normalizing
   Maintenance ticket MNT-201 is marked Resolved
```

---

## Cross-Role Emergency Flow (Multi-stakeholder scenario)

```
FAN                    VOLUNTEER              ORGANIZER              STAFF
 │                        │                       │                    │
 │ [Fan presses SOS]       │                       │                    │
 ├──────────────────────────────────────────────►  │                    │
 │                        │                INC-104 created              │
 │                        │                Priority: Medical            │
 │                        │                AI Triage triggered          │
 │                        │                       │                    │
 │                        │          [Organizer dispatches]             │
 │                        │◄──────────────────────┤                    │
 │             Volunteer assigned                 │                    │
 │             task via Task Hub                  │                    │
 │                        │                       │                    │
 │              [Volunteer assists fan]            │                    │
 │                        │         [Organizer resolves INC-104]       │
 │                        │                       │                    │
 │         Emergency cleared.                     │  [Staff clears     │
 │         Broadcast sent to all fans:             │   any hazard        │
 │         "All clear. Match continues."           │   related MNT]     │
 │◄──────────────────────────────────────────────────────────────────► │
```

---

## Navigation Map

```
/ (Single Page Application)
│
├── Home Page
│   ├── Hero Banner (Live system telemetry)
│   ├── Role Portal Cards (Fan, Organizer, Volunteer, Staff)
│   └── Active Dashboard Section (lazy-loaded by role)
│
├── Fan Companion Dashboard
│   ├── Match Info Banner
│   ├── AI Match Assistant (Chat UI)
│   ├── Seating Path Navigator
│   ├── Food Queue Intelligence
│   ├── Transit & Eco Planner
│   └── Emergency SOS Button
│
├── Organizer Command Dashboard
│   ├── Live Status Overview (Gates, Parking, Food Courts)
│   ├── Crowd Heatmap (SVG visualization)
│   ├── Active Incidents + AI Triage
│   └── Emergency Broadcast Console
│
├── Volunteer Hub Dashboard
│   ├── AI Translator (6 languages)
│   ├── Lost & Found Registry
│   │   ├── Log New Item
│   │   └── Search & Filter
│   └── Volunteer Task Manager
│
└── Staff Portal Dashboard
    ├── Hardware Telemetry Overview
    ├── Maintenance Ticket Queue
    ├── AI Priority Analyzer
    └── Parking Status Panel
```
