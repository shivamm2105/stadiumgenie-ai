# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in StadiumGenie AI, please report it responsibly.

**Do not create a public GitHub issue for security vulnerabilities.**

### How to Report

1. Email the repository maintainer via GitHub's private vulnerability reporting feature.
2. Include a description of the vulnerability, steps to reproduce, and the potential impact.
3. We will acknowledge your report within 48 hours and provide a timeline for resolution.

---

## Supported Versions

| Version | Supported |
|---|---|
| 1.0.x | ✅ Yes |

---

## Known Security Mitigations

StadiumGenie AI implements the following security controls:

- **Helmet.js HTTP headers** — XSS protection, clickjacking prevention, MIME sniffing protection
- **express-validator** — All user inputs are sanitized and HTML-escaped before processing
- **Enum whitelisting** — Constrained fields (language, priority, transit preference) use strict allowlists
- **API key isolation** — Gemini API key is server-side only, never exposed to the client
- **Production error sanitization** — Stack traces stripped in production mode
- **No PII storage** — No user accounts, no cookies, no tracking

See [docs/SECURITY.md](docs/SECURITY.md) for a complete security architecture overview.
