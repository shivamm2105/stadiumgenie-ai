# StadiumGenie AI — API Reference

Complete reference for all REST API endpoints exposed by the StadiumGenie AI backend server.

**Base URL**: `http://localhost:5000` (development) | `https://your-render-url.onrender.com` (production)

---

## Authentication

The current API does not require authentication tokens. All endpoints are open. The API key for Google Gemini is stored server-side only and is never exposed to the client.

---

## Common Response Formats

### Success Response
```json
HTTP 200 OK
Content-Type: application/json
```

### Validation Error
```json
HTTP 400 Bad Request
{
  "error": {
    "message": "Input validation failed. Please check parameters.",
    "details": [
      { "field": "fieldName", "issue": "Specific validation error message" }
    ]
  }
}
```

### Not Found
```json
HTTP 404 Not Found
{
  "error": { "message": "Not Found - /api/invalid-path" }
}
```

### Server Error
```json
HTTP 500 Internal Server Error
{
  "error": { "message": "Internal server error" }
}
```

---

## Health Check

### `GET /health`

Returns server health status.

**Response**
```json
{
  "status": "healthy",
  "timestamp": "2026-07-14T16:30:00.000Z",
  "env": "production"
}
```

---

## Stadium Status API

Base path: `/api/status`

---

### `GET /api/status`

Returns the complete stadium operational state including all gates, parking, food courts, incidents, lost & found items, volunteer roster, match information, maintenance tickets, and volunteer tasks.

**Response**
```json
{
  "gates": [
    {
      "id": "Gate A",
      "label": "Gate A (North Entrance)",
      "occupancy": 90,
      "status": "Critical",
      "coordinator": "Sarah Jenkins"
    },
    {
      "id": "Gate B",
      "label": "Gate B (South Entrance)",
      "occupancy": 35,
      "status": "Normal",
      "coordinator": "Marcus Aurelius"
    },
    {
      "id": "Gate C",
      "label": "Gate C (East Entrance)",
      "occupancy": 60,
      "status": "Moderate",
      "coordinator": "Elena Rostova"
    },
    {
      "id": "Gate D",
      "label": "Gate D (West VIP/Accessibility)",
      "occupancy": 15,
      "status": "Normal",
      "coordinator": "Kenji Sato"
    }
  ],
  "parking": [...],
  "foodCourts": [...],
  "incidents": [...],
  "lostAndFound": [...],
  "volunteers": [...],
  "matchInfo": {
    "teams": { "home": "Mexico", "away": "USA" },
    "venue": "MetLife Stadium",
    "timeToKickoff": 45,
    "weather": "72°F Clear, Humidity 45%",
    "attendanceSimulated": 78500,
    "emergencyAlert": null
  },
  "maintenanceTickets": [...],
  "volunteerTasks": [...]
}
```

---

### `POST /api/status/incident`

Reports a new safety or crowd incident to the operations center.

**Request Body**
```json
{
  "category": "string (required) — e.g., Crowd Control | Medical | Facilities | Security",
  "location": "string (required) — e.g., Concourse Section 112, Gate A",
  "description": "string (required) — detailed incident description",
  "reportedBy": "string (optional) — reporter identifier (default: Fan-Anonymous)"
}
```

**Validation Rules**
- `category`: required, non-empty string
- `location`: required, non-empty string
- `description`: required, non-empty string
- `reportedBy`: optional string

**Response** `HTTP 201 Created`
```json
{
  "message": "Incident reported successfully.",
  "incident": {
    "id": "INC-104",
    "category": "Medical",
    "location": "Gate A ticketing gates",
    "description": "Fan collapsed near entry scanner.",
    "status": "Active",
    "reportedBy": "Vol-Carlos",
    "timestamp": "16:45",
    "priority": "Medium"
  }
}
```

---

### `PUT /api/status/incident/:id`

Updates the status, priority, suggested actions, or assigned staff for an existing incident.

**Path Parameters**
- `id`: Incident ID (e.g., `INC-101`)

**Request Body** (all optional)
```json
{
  "status": "Active | Resolved | Pending",
  "priority": "Low | Medium | High | Critical",
  "suggestedActions": ["Action 1", "Action 2", "Action 3"],
  "staffNeeded": "string — responder roles to dispatch"
}
```

**Response** `HTTP 200 OK`
```json
{
  "message": "Incident updated successfully.",
  "incident": { "id": "INC-101", "status": "Resolved", ... }
}
```

**Error** `HTTP 404`
```json
{ "error": "Incident not found." }
```

---

### `POST /api/status/lost-and-found`

Registers a recovered lost property item in the digital registry.

**Request Body**
```json
{
  "item": "string (required) — item name (e.g., iPhone 15 Pro Max)",
  "description": "string (required) — identifying description",
  "category": "Electronics | Wallet/ID | Apparel | Keys | General (required)",
  "locationFound": "string (optional) — where item was found (default: Unknown)",
  "status": "Lost | Found | Claimed (optional, default: Found)"
}
```

**Response** `HTTP 201 Created`
```json
{
  "message": "Lost & Found item registered successfully.",
  "item": {
    "id": "LF-04",
    "item": "iPhone 15 Pro Max",
    "description": "Blue titanium case, lock screen shows a dog",
    "category": "Electronics",
    "locationFound": "Gate A Info Desk",
    "status": "Found",
    "dateAdded": "2026-07-14"
  }
}
```

---

### `POST /api/status/maintenance`

Submits a new facilities maintenance or hardware malfunction ticket.

**Request Body**
```json
{
  "details": "string (required) — issue description",
  "location": "string (required) — physical location of the issue",
  "priority": "Low | Medium | High | Critical (optional)",
  "etaMinutes": "integer 1–240 (optional)",
  "allocatedTeam": "string (optional) — team department name",
  "justification": "string (optional) — reason for priority assignment"
}
```

**Response** `HTTP 201 Created`
```json
{
  "message": "Maintenance report logged successfully.",
  "ticket": {
    "id": "MNT-203",
    "details": "Broken glass near concession Stand 3",
    "location": "Concourse Section 102",
    "priority": "High",
    "etaMinutes": 15,
    "allocatedTeam": "Cleaning Crew",
    "justification": "Slip hazard in high-density aisle",
    "status": "Assigned",
    "timestamp": "16:52"
  }
}
```

---

### `PUT /api/status/task/:id`

Updates the completion status of a volunteer task assignment.

**Path Parameters**
- `id`: Task ID (e.g., `T-01`)

**Request Body**
```json
{
  "status": "Pending | In Progress | Completed (required)"
}
```

**Response** `HTTP 200 OK`
```json
{
  "message": "Task updated successfully.",
  "task": { "id": "T-01", "status": "Completed", ... }
}
```

**Error** `HTTP 404`
```json
{ "error": "Volunteer task not found." }
```

---

### `POST /api/status/emergency`

Triggers or clears a global emergency broadcast alert visible to all active users.

**Request Body**
```json
{
  "message": "string (optional) — broadcast message text. Omit or set to null to clear the alert."
}
```

**Examples**

Trigger alert:
```json
{ "message": "ALERT: Heavy rain approaching. Please move to covered areas." }
```

Clear alert:
```json
{ "message": null }
```

**Response** `HTTP 200 OK`
```json
{
  "message": "Emergency broadcast triggered.",
  "matchInfo": { "emergencyAlert": "ALERT: Heavy rain approaching..." }
}
```

---

## AI API

Base path: `/api/ai`

All AI endpoints use `POST` method, accept `application/json`, and use the Gemini 1.5 Flash model with intelligent mock fallback.

---

### `POST /api/ai/match-assistant`

AI-powered conversational assistant for stadium fans. Answers natural language queries about seating, food, gates, exits, and match information.

**Request Body**
```json
{
  "query": "string (required) — fan's question",
  "chatHistory": "array (optional) — previous conversation turns"
}
```

**Example Request**
```json
{
  "query": "Where is Gate D?",
  "chatHistory": [
    { "role": "user", "content": "Hi, I need help finding my seat." },
    { "role": "assistant", "content": "Sure! What is your section number?" }
  ]
}
```

**Response**
```json
{
  "reply": "Gate D is located on the West side of the stadium and provides wheelchair accessible entry directly to the lower-tier ADA seating. Stewards at Gate D are also available to assist mobility-impaired visitors. It is the quietest entry point with only 15% occupancy currently."
}
```

**Validation**
- `query`: required, non-empty, HTML-escaped string
- `chatHistory`: optional array

---

### `POST /api/ai/translate`

Real-time AI translation of operational stadium messages into 6 languages.

**Request Body**
```json
{
  "text": "string (required) — text to translate",
  "targetLanguage": "Spanish | French | German | Arabic | Japanese | Portuguese (required)"
}
```

**Example Request**
```json
{
  "text": "Gate A is currently full. Please enter through Gate B.",
  "targetLanguage": "Spanish"
}
```

**Response**
```json
{
  "translatedText": "La puerta A está llena en este momento. Por favor ingrese por la puerta B."
}
```

**Validation**
- `text`: required, non-empty, HTML-escaped
- `targetLanguage`: whitelisted enum only

**Supported Languages**: Spanish, French, German, Arabic, Japanese, Portuguese

---

### `POST /api/ai/incident-summary`

AI emergency triage engine. Analyzes incident descriptions and returns structured priority classification, response checklist, and staff dispatch recommendation.

**Request Body**
```json
{
  "description": "string (required) — incident details",
  "category": "string (required) — incident category"
}
```

**Example Request**
```json
{
  "description": "Elderly fan collapsed near Gate A ticketing checkpoint, unresponsive.",
  "category": "Medical"
}
```

**Response**
```json
{
  "summaryData": {
    "summary": "Medical emergency requiring immediate paramedic response at Gate A entry.",
    "priority": "High",
    "suggestedActions": [
      "Dispatch nearest mobile first-aid volunteer with stretcher",
      "Clear accessibility path for paramedic vehicle entry",
      "Inform regional control booth supervisor"
    ],
    "staffNeeded": "Gate A Medical Responders + Volunteer Escort"
  }
}
```

**Validation**
- `description`: required, non-empty, HTML-escaped
- `category`: required, non-empty, HTML-escaped

---

### `POST /api/ai/priority`

AI maintenance prioritization engine. Analyzes ticket descriptions and returns severity, team assignment, resolution ETA, and justification.

**Request Body**
```json
{
  "details": "string (required) — maintenance issue description"
}
```

**Example Request**
```json
{
  "details": "Turnstile A3 ticketing scanner is frozen and rejecting all tickets."
}
```

**Response**
```json
{
  "priorityData": {
    "priority": "Critical",
    "etaMinutes": 10,
    "allocatedTeam": "IT Operations / Hardware Support",
    "justification": "Scanner failure causes gate bottleneck and fan entry disruption."
  }
}
```

**Validation**
- `details`: required, non-empty, HTML-escaped

**Priority Levels**: Critical, High, Medium, Low

---

### `POST /api/ai/food-recommendation`

AI food and concourse routing recommendation based on dietary preference and crowd conditions.

**Request Body** (all fields optional)
```json
{
  "dietaryPreference": "string — e.g., Vegan, Gluten-Free, None",
  "crowdDensity": "string — Low | Medium | High",
  "gatesOccupancy": "string — gate load summary, e.g., Gate A: 90%, Gate B: 35%"
}
```

**Example Request**
```json
{
  "dietaryPreference": "Vegan",
  "crowdDensity": "High",
  "gatesOccupancy": "Gate A: 90%, Gate B: 35%, Gate C: 60%"
}
```

**Response**
```json
{
  "recommendation": "We highly recommend Golden Goal Greens (FC-3) for vegan options with only a 5-minute wait. Access via the East Concourse ramp to avoid congestion near Gate A. Golden Goal Greens offers fresh vegan wraps, salads, and water."
}
```

---

### `POST /api/ai/transit-eco`

AI transit planner providing gate-load-aware routing and eco sustainability guidance for post-event travel.

**Request Body**
```json
{
  "destination": "string (required) — travel destination",
  "preference": "Metro | Bus | Rideshare (required)",
  "gateLoad": "string (optional) — current gate load summary"
}
```

**Example Request**
```json
{
  "destination": "JFK Airport",
  "preference": "Metro",
  "gateLoad": "Gate A: 90%, Gate B: 35%"
}
```

**Response**
```json
{
  "recommendation": "Take Metro Line 2 from Gate B station (35% load) to JFK Airport — estimated travel time is 38 minutes. 🌲 Sustainability Tip: Rail transit reduces your carbon footprint by 85% compared to rideshare, helping FIFA's Green Venue Goals."
}
```

**Validation**
- `destination`: required, non-empty, HTML-escaped
- `preference`: whitelisted enum (Metro, Bus, Rideshare)
- `gateLoad`: optional string
