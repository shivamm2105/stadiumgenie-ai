# StadiumGenie AI — Security Documentation

This document covers all security measures implemented in StadiumGenie AI to protect against common web vulnerabilities, API abuse, and information disclosure.

---

## Security Layers

StadiumGenie AI implements a defense-in-depth approach with multiple independent security layers:

```
Request
  │
  ├── TLS/HTTPS encryption (Render HTTPS termination)
  ├── Helmet.js HTTP security headers
  ├── CORS policy enforcement
  ├── express-validator input sanitization + validation
  ├── HTML escaping (.escape()) on all user inputs
  ├── Enum whitelisting for constrained fields
  └── Error handler (no stack traces in production)
```

---

## HTTP Security Headers (Helmet.js)

All responses include the following security headers via `helmet()` middleware:

| Header | Value | Protection Against |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | MIME type sniffing attacks |
| `X-Frame-Options` | `DENY` | Clickjacking / UI redress attacks |
| `X-XSS-Protection` | `0` (modern browsers) | XSS (handled via CSP instead) |
| `Referrer-Policy` | `no-referrer` | Referrer information leakage |
| `X-DNS-Prefetch-Control` | `off` | DNS prefetch leakage |
| `Strict-Transport-Security` | `max-age=15552000` | Downgrade/MitM attacks (HTTPS enforcement) |
| `Permissions-Policy` | Restricted | Browser feature abuse |

**Note**: `contentSecurityPolicy` is intentionally relaxed to allow Vite-built React assets and Google Fonts to load correctly from the same-origin static file server. This is a deliberate tradeoff for the hackathon single-URL deployment model.

---

## Input Sanitization & Validation

All user-supplied input is validated and sanitized using `express-validator` before reaching any controller or AI service.

### Sanitization Pattern
Every string field is processed with the chain:
```js
body('fieldName')
  .trim()           // Strip leading/trailing whitespace
  .notEmpty()       // Reject blank strings
  .isString()       // Type enforcement
  .escape()         // HTML-encode: < > & " ' → HTML entities
```

The `.escape()` call converts dangerous HTML characters to their entity equivalents, preventing XSS attacks via injected HTML/JavaScript in API responses that are later rendered in the UI.

### Enum Whitelisting
Constrained fields use `.isIn([...allowedValues])` to reject invalid or malicious values:

```js
// Prevents injection via unsupported language codes or SQL fragments
body('targetLanguage')
  .isIn(['Spanish', 'French', 'German', 'Arabic', 'Japanese', 'Portuguese'])

// Prevents arbitrary priority injection
body('priority')
  .isIn(['Low', 'Medium', 'High', 'Critical'])

// Prevents arbitrary transit type injection
body('preference')
  .isIn(['Metro', 'Bus', 'Rideshare'])
```

### Integer Range Validation
Numeric fields enforce sane bounds:
```js
body('etaMinutes')
  .isInt({ min: 1, max: 240 }) // 1 min to 4 hours maximum
```

---

## CORS Policy

```js
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Current policy**: Open wildcard CORS is appropriate for the hackathon context (public demo platform). In a production stadium deployment, this would be restricted to:
```js
origin: ['https://stadiumgenie.app', 'https://admin.stadiumgenie.app']
```

---

## API Key Security

The Google Gemini API key is stored exclusively server-side via environment variables:

```
Server: GEMINI_API_KEY=AIza... (loaded via dotenv, never transmitted to client)
Client: No API key — all AI calls routed through /api/ai/* proxy endpoints
```

**Benefits**:
1. API key never appears in browser network inspector tabs
2. API key never included in client JS bundle
3. Rate limiting and quota enforcement happens at the server level
4. API key can be rotated without client deployment

---

## Error Information Disclosure Prevention

The global error handler `middleware/error.js` strips stack traces in production:

```js
export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal server error',
      // No stack trace in production — prevents source disclosure
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}
```

In production (`NODE_ENV=production`), clients receive only the error message — never the full stack trace or file path information.

---

## Data Privacy

### No Personally Identifiable Information (PII) Stored
- No user authentication or account system
- No cookies set by the server
- No analytics or tracking scripts
- Volunteer names in mock data are fictional
- Incident reporters are identified by role codes only (e.g., `Staff-Jane`, `Vol-Ahmed`)

### LocalStorage Usage
Client-side `localStorage` stores:
- `sg_stadium_state`: Fallback stadium operational data (non-sensitive)
- `sg_acc_*`: User accessibility preferences (non-sensitive, non-PII)
- `sg_theme`: Dark/light mode preference (non-sensitive)

No sensitive information, credentials, or PII is ever stored in localStorage.

---

## Dependency Security

### Production Dependencies Only at Runtime
The server uses only the following production runtime dependencies:
- `express` — battle-tested HTTP framework
- `@google/generative-ai` — official Google SDK
- `helmet` — maintained by Express security team
- `cors` — standard CORS middleware
- `compression` — standard gzip middleware
- `express-validator` — widely-used validation library
- `dotenv` — environment variable loading

### Keeping Dependencies Updated
To audit for known vulnerabilities:
```bash
npm audit --prefix client
npm audit --prefix server
```

---

## Future Security Enhancements (Post-Hackathon)

For a production stadium deployment, the following enhancements would be required:

| Enhancement | Priority | Rationale |
|---|---|---|
| JWT authentication + role verification | Critical | Prevent unauthorized access to organizer/staff endpoints |
| Rate limiting per IP (`express-rate-limit`) | High | Prevent AI API quota exhaustion and DoS |
| Restricted CORS origin whitelist | High | Prevent cross-site request abuse |
| Database-backed persistent storage | High | In-memory state lost on server restart |
| Audit logging for all POST/PUT operations | Medium | Operational traceability for incidents and emergencies |
| Input length limits (`.isLength()`) | Medium | Prevent oversized prompt injection to AI services |
| Webhook signatures for emergency broadcasts | Medium | Prevent unauthorized emergency alert spoofing |
