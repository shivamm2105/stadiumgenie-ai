# Contributing to StadiumGenie AI

Thank you for your interest in contributing to StadiumGenie AI!

---

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/))

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/shivamm2105/stadiumgenie-ai.git
cd stadiumgenie-ai

# 2. Install all dependencies
npm run install:all

# 3. Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# 4. Start development servers
npm run dev
```

---

## Project Structure

```
stadiumgenie-ai/
├── client/          # React + Vite frontend
├── server/          # Express + Node.js backend
├── docs/            # Technical documentation
└── package.json     # Root monorepo scripts
```

---

## Development Guidelines

### Code Quality
- Run `npm run lint` before committing — zero warnings/errors required
- Run `npm test` to ensure all 74 tests pass
- Follow existing JSDoc comment patterns in controllers and hooks
- Use `useCallback` and `useMemo` for performance-sensitive components

### Naming Conventions
- Components: PascalCase (`GlassCard.jsx`)
- Hooks: camelCase with `use` prefix (`useStadiumState.js`)
- Constants: UPPER_SNAKE_CASE (`USER_ROLES`)
- API endpoints: kebab-case (`/api/ai/match-assistant`)

### Commit Messages
Use semantic commit prefixes:
- `feat:` — New features
- `fix:` — Bug fixes
- `docs:` — Documentation only
- `refactor:` — Code restructuring without feature change
- `test:` — Test additions or corrections
- `perf:` — Performance improvements
- `chore:` — Build, config, dependency changes

---

## Pull Request Process

1. Fork the repository and create a feature branch from `main`
2. Make your changes following the guidelines above
3. Add or update tests for new functionality
4. Ensure `npm run lint` and `npm test` pass
5. Submit a Pull Request with a clear description of the change

---

## Core Principles

1. **Do not break existing functionality** — The application is production-deployed
2. **Do not modify AI prompts** without documenting the reason and testing fallback behavior
3. **Maintain accessibility** — All UI changes must maintain WCAG 2.2 AA compliance minimum
4. **Test coverage** — New backend routes should have corresponding test cases in `server/__tests__/`
5. **No PII** — Do not introduce user authentication or PII storage without a privacy review

---

## Running Tests

```bash
# All tests
npm test

# Client only
npm run test --prefix client

# Server only
npm run test --prefix server

# Coverage report
npm run test:coverage
```

---

## Questions?

Open a GitHub Discussion or Issue for any questions about contributing.
