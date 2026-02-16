# MarexFX Demo — Global Payments Dashboard

A mock payments orchestration dashboard demonstrating the technical skills required for a Global Payments Software Developer role. Built with Next.js 14, TypeScript, Tailwind CSS, and modern React patterns.

> **Disclaimer**: Demonstration application. Not affiliated with Marex Group plc.

## Features

- **Dashboard** — KPI cards, live FX ticker, recent payments, 7-day volume chart
- **Payment Initiation** — Multi-field form with Zod validation, live indicative rates, confirmation dialog
- **Transaction History** — TanStack Table with sorting, filtering, pagination, mobile cards, CSV export
- **FX Rates** — Real-time rate cards with sparklines, category tabs (G10 / EM), connection status
- **About** — JD requirements mapped to project implementation

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Tables | TanStack Table |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Testing | Vitest + React Testing Library |
| CI/CD | GitHub Actions |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript type check |

## Security

- CSP headers, X-Frame-Options: DENY, X-Content-Type-Options: nosniff
- Client + server Zod validation (defense in depth)
- JSX escaping for XSS prevention
- Production notes for OAuth, JWT, rate limiting, audit logging

## Accessibility

- WCAG 2.1 AA target
- Semantic HTML, ARIA live regions, skip-to-content link
- Keyboard navigation, focus management
- `prefers-reduced-motion` support
- Color + icon + text for status indicators
