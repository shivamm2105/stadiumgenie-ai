# StadiumGenie AI — AI Architecture Documentation

This document details the AI integration architecture, rationale, prompt engineering patterns, request/response lifecycle, error handling, and fallback behavior for all six AI-powered features in StadiumGenie AI.

---

## Why AI Is Required

StadiumGenie AI addresses six distinct operational challenges that require contextual, natural-language intelligence — challenges that rigid rule-based systems cannot handle effectively:

| Problem | Why AI Is Required |
|---|---|
| **Fan queries** | Free-form natural language questions about seating, food, exits — too varied for static FAQ trees |
| **Multilingual translation** | 150+ nationalities need real-time, culturally appropriate translation of operational messages |
| **Incident triage** | Complex emergency descriptions require semantic understanding to classify priority and generate specific dispatch checklists |
| **Maintenance prioritization** | Facility reports use varied natural language; AI identifies hazard severity that keyword matching would miss |
| **Food routing** | Dietary preferences combined with real-time crowd density require contextual reasoning, not static rules |
| **Eco transit planning** | Destination-specific routing combined with sustainability guidance requires generative, context-aware responses |

---

## AI Provider

**Google Gemini 1.5 Flash** via `@google/generative-ai` Node.js SDK.

- Model: `gemini-1.5-flash`  
- Accessed through server-side Express API (API key never exposed to client)
- Structured JSON output mode for incident triage and maintenance prioritization
- Free-text generation mode for match assistant, translation, food, and transit features

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React/Vite)                           │
│                                                                       │
│  User Input → AiService.askMatchAssistant(query, chatHistory)         │
│            → AiService.translateText(text, targetLanguage)           │
│            → AiService.getIncidentSummary(description, category)     │
│            → AiService.getMaintenancePriority(details)               │
│            → AiService.getFoodRecommendation(pref, density, gates)   │
│            → AiService.getTransitEco(destination, preference, load)  │
│                         │                                             │
│            [aiCache + inFlightAI deduplication]                      │
│                         │                                             │
└─────────────────────────┼─────────────────────────────────────────── ┘
                          │
                          ▼ POST /api/ai/{endpoint}
┌─────────────────────────────────────────────────────────────────────┐
│                     SERVER (Express/Node.js)                          │
│                                                                       │
│  express-validator middleware (input sanitization + validation)       │
│                         │                                             │
│                         ▼                                             │
│  aiController.js (route handlers → calls geminiService.js)           │
│                         │                                             │
│                         ▼                                             │
│  geminiService.js → Google Gemini 1.5 Flash API                      │
│                    (or mock simulators if GEMINI_API_KEY=mock)        │
│                                                                       │
│  Response → JSON → aiController → Express response                   │
└─────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
               Client receives response and renders
```

---

## Module 1: AI Match Assistant

### Endpoint
```
POST /api/ai/match-assistant
```

### Purpose
Conversational AI chatbot for stadium fans — answers questions about seating, food, gates, exits, emergencies, and match information in real-time.

### System Prompt Design
```
You are StadiumGenie AI Match Assistant for the FIFA World Cup 2026.
You are helping fans in the stadium with real-time queries, seating navigation,
rules, matches, and stadium amenities.
Be welcoming, concise, clear, and prioritize stadium safety and accessibility.
Assume the current match is Mexico vs. USA, and the stadium is equipped with gates
A, B, C, D (D is wheelchair accessible). Keep response under 4 sentences.
```

**Design rationale:**
- Context-anchoring (FIFA 2026, specific gate layout) prevents hallucinated responses about other venues
- Response length cap (4 sentences) enforces concise, actionable answers
- Safety priority instruction ensures emergency content surfaces appropriately

### Request Schema
```json
{
  "query": "string (required) — fan's natural language question",
  "chatHistory": "array (optional) — previous conversation turns for context"
}
```

### Response Schema
```json
{
  "reply": "string — AI-generated response text"
}
```

### Prompt Construction
The chatHistory array is serialized as JSON and embedded before the query, enabling multi-turn conversational memory:
```
{systemPrompt}

Chat History:
[{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]

Fan Query: {query}
Assistant:
```

### Validation Rules
- `query`: required, non-empty string, HTML-escaped
- `chatHistory`: optional, must be an array

---

## Module 2: AI Multilingual Translator

### Endpoint
```
POST /api/ai/translate
```

### Purpose
Real-time translation of operational stadium messages for international fans who don't speak English.

### System Prompt Design
```
You are a real-time translator at the FIFA World Cup 2026.
Translate the text exactly into {targetLanguage}. Maintain a polite,
helpful tone for stadium visitors. Only output the translated text.
```

**Design rationale:**
- "Only output the translated text" eliminates wrapping explanations, enabling direct display to users
- Tone instruction ("polite, helpful") ensures culturally appropriate phrasing for public-facing communications

### Request Schema
```json
{
  "text": "string (required) — text to translate",
  "targetLanguage": "enum (required) — Spanish | French | German | Arabic | Japanese | Portuguese"
}
```

### Response Schema
```json
{
  "translatedText": "string — translated output in target language"
}
```

### Validation Rules
- `targetLanguage`: whitelisted enum — prevents arbitrary injection through unsupported language codes
- `text`: HTML-escaped to prevent XSS in displayed translations

---

## Module 3: AI Incident Triage & Emergency Response

### Endpoint
```
POST /api/ai/incident-summary
```

### Purpose
Analyzes safety incident descriptions and generates structured triage data: severity priority, response actions, and required staff assignments.

### System Prompt Design
```
You are a Senior AI Emergency Decision Support Agent in the Stadium Operations
Center for the FIFA World Cup 2026. Analyze the following safety incident details.
Output ONLY a valid JSON object matching the schema below.
Do not wrap the JSON output in markdown block tick codes.

Required JSON format:
{
  "summary": "Brief 1-sentence technical operational summary of the incident.",
  "priority": "High, Medium, or Low based on safety and crowd flow impact.",
  "suggestedActions": ["Step 1", "Step 2", "Step 3"],
  "staffNeeded": "Specify exactly which staff/responder roles are required."
}
```

**Design rationale:**
- Explicit JSON schema in the prompt + `responseMimeType: 'application/json'` for deterministic, parseable output
- "Do not wrap in markdown ticks" prevents common LLM formatting artifacts that break `JSON.parse()`
- Three-level priority (High/Medium/Low) maps directly to UI indicator colors

### Request Schema
```json
{
  "description": "string (required) — incident description text",
  "category": "string (required) — incident category label"
}
```

### Response Schema
```json
{
  "summaryData": {
    "summary": "string — 1-sentence operational summary",
    "priority": "High | Medium | Low",
    "suggestedActions": ["string", "string", "string"],
    "staffNeeded": "string — specific responder roles"
  }
}
```

### Generation Config
```js
generationConfig: { responseMimeType: 'application/json' }
```
This forces Gemini to emit valid JSON tokens only, reducing output parsing failures.

---

## Module 4: AI Maintenance Priority Engine

### Endpoint
```
POST /api/ai/priority
```

### Purpose
Evaluates maintenance/facilities ticket descriptions and assigns priority level, team allocation, resolution ETA, and justification.

### System Prompt Design
```
You are the Lead AI Facilities Coordinator for the stadium during the FIFA World Cup 2026.
Evaluate the reported maintenance/cleaning ticket details. Output ONLY a valid JSON object.

Required JSON format:
{
  "priority": "Critical, High, Medium, or Low",
  "etaMinutes": 15,
  "allocatedTeam": "Department name",
  "justification": "Brief 1-sentence explanation"
}
```

**Design rationale:**
- Four-tier priority (Critical/High/Medium/Low) maps to operational response urgency
- `etaMinutes` as integer enables concrete dispatch scheduling
- `allocatedTeam` enables automatic routing to the correct facilities department

### Request Schema
```json
{
  "details": "string (required) — maintenance issue description"
}
```

### Response Schema
```json
{
  "priorityData": {
    "priority": "Critical | High | Medium | Low",
    "etaMinutes": "integer — estimated resolution minutes",
    "allocatedTeam": "string — responsible team name",
    "justification": "string — reasoning sentence"
  }
}
```

---

## Module 5: AI Food & Concourse Recommendation

### Endpoint
```
POST /api/ai/food-recommendation
```

### Purpose
Provides personalized dining recommendations based on dietary preference, real-time crowd density, and gate queue occupancy.

### System Prompt Design
```
You are the lead StadiumGenie AI Food & Concourse Logistics Planner.
Recommend the optimal dining concessions and route selections based on:
- Dietary preferences: {dietaryPreference}
- Current crowd density: {crowdDensity}
- Live gate queues: {gatesOccupancy}

Provide a polite, tailored dining recommendation, suggest concession wait times,
and specify an optimal route. Keep the response under 3 sentences.
```

**Design rationale:**
- Dynamic context injection (crowd density, gate loads) personalizes recommendations in real-time
- Response length cap (3 sentences) keeps output scannable and actionable

### Request Schema
```json
{
  "dietaryPreference": "string (optional) — dietary preference",
  "crowdDensity": "string (optional) — Low | Medium | High",
  "gatesOccupancy": "string (optional) — gate occupancy summary"
}
```

### Response Schema
```json
{
  "recommendation": "string — personalized concession and route recommendation"
}
```

---

## Module 6: AI Transit & Eco Route Planner

### Endpoint
```
POST /api/ai/transit-eco
```

### Purpose
Plans optimal post-match transit routes and provides eco-sustainability tips based on destination, preference, and current gate load data.

### System Prompt Design
```
You are StadiumGenie AI Transit & Sustainability Coordinator for the FIFA World Cup 2026.
Recommend the optimal transportation plan to "{destination}" using "{preference}"
considering gate load is "{gateLoad}".

Provide:
1. Recommended transit route & estimated travel time.
2. An eco-friendly travel tip to lower carbon footprint.
Keep the total response under 3 sentences. Be precise.
```

**Design rationale:**
- Eco tip requirement aligns with FIFA 2026 sustainability mandate
- Gate load context prevents recommending Gate A exits when they're at 90% capacity

### Request Schema
```json
{
  "destination": "string (required) — destination address or location",
  "preference": "enum (required) — Metro | Bus | Rideshare",
  "gateLoad": "string (optional) — current gate occupancy summary"
}
```

### Response Schema
```json
{
  "recommendation": "string — route directions + eco sustainability tip"
}
```

---

## Error Handling & Fallback Architecture

StadiumGenie AI implements a three-tier resilience strategy:

### Tier 1: Server-side try/catch → Mock AI Simulators

Every `geminiService.js` function wraps Gemini API calls in try/catch. On any API error:

```js
try {
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
} catch (error) {
  console.error('Gemini API Error:', error);
  return simulateMatchAssistant(query) + ' (Fallback)'; // intelligent local logic
}
```

The mock simulators (`simulateMatchAssistant`, `simulateTranslation`, etc.) implement pattern-matching heuristics that cover the most common query patterns, returning realistic responses without any AI call.

### Tier 2: Mock AI Mode (`GEMINI_API_KEY=mock`)

If `GEMINI_API_KEY` is set to `"mock"`, `isMockAI` is `true` and all Gemini calls are skipped entirely — returning mock simulator responses. This enables:
- Development without API quota consumption
- Testing environments with deterministic responses
- Offline demonstrations

### Tier 3: Client-Side Fallback (`simulateClientAIResponse`)

If the Express backend is entirely unreachable, `AiService` methods catch the fetch error and call `simulateClientAIResponse()` — a browser-side heuristic engine replicating the server-side mock logic. This ensures AI features remain functional even without any server.

---

## Input Validation & Security

All AI endpoints are protected by `express-validator` middleware before reaching controllers:

| Endpoint | Key Validations |
|---|---|
| `/match-assistant` | `query` required, string, HTML-escaped; `chatHistory` optional array |
| `/translate` | `targetLanguage` whitelisted enum (Spanish/French/German/Arabic/Japanese/Portuguese) |
| `/incident-summary` | `description` required, escaped; `category` required, escaped |
| `/priority` | `details` required, non-empty, escaped |
| `/food-recommendation` | All fields optional, string, escaped |
| `/transit-eco` | `preference` whitelisted enum (Metro/Bus/Rideshare); `destination` required |

Validation failures return `HTTP 400` with structured field-level error details:
```json
{
  "error": {
    "message": "Input validation failed. Please check parameters.",
    "details": [{ "field": "targetLanguage", "issue": "Language selected is not supported currently" }]
  }
}
```

---

## Performance Optimizations

### Client-Side AI Response Caching
```js
const aiCache = {};
const inFlightAI = {};

async function cachedAIFetch(endpoint, body) {
  const cacheKey = `${endpoint}:${JSON.stringify(body)}`;
  if (aiCache[cacheKey]) return aiCache[cacheKey]; // Instant cache hit
  if (inFlightAI[cacheKey]) return inFlightAI[cacheKey]; // Deduplication
  // ... fetch and store
}
```

- **Cache hit**: Identical queries (same endpoint + body) return cached results instantly — no network round-trip
- **In-flight deduplication**: Multiple concurrent identical requests share a single promise — preventing duplicate Gemini API calls
- **No TTL on AI cache**: AI responses are query-specific and unlikely to change; responses are cached for session lifetime

### Server-Side Compression
All API responses are compressed via `compression` middleware (Gzip/Brotli), reducing AI response payload sizes by ~70%.
