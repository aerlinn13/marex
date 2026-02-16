import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2 } from "lucide-react";

const skillMapping = [
  {
    requirement: "React & Next.js (SSR, SPA)",
    experience: "Built this entire dashboard using Next.js 14 App Router with server and client components.",
    demoLocation: "All pages — hybrid SSR + client-side rendering",
  },
  {
    requirement: "TypeScript (Strict Mode)",
    experience: "Full strict-mode TypeScript across the codebase — interfaces, generics, discriminated unions.",
    demoLocation: "src/types, all components",
  },
  {
    requirement: "WebSocket Integration",
    experience: "Mock WebSocket engine with publish/subscribe pattern, singleton lifecycle, and real-time rate updates.",
    demoLocation: "FX Rates page, Dashboard ticker",
  },
  {
    requirement: "REST API Design",
    experience: "Next.js Route Handlers with proper HTTP status codes, Zod validation, and error handling.",
    demoLocation: "src/app/api/* routes",
  },
  {
    requirement: "Data-Heavy Tables",
    experience: "TanStack Table with sorting, multi-faceted filtering, pagination, search, and responsive mobile cards.",
    demoLocation: "Transaction History page",
  },
  {
    requirement: "Form Validation & Security",
    experience: "React Hook Form + Zod with client AND server validation (defense in depth). Input sanitization, CSP headers.",
    demoLocation: "Payment Initiation page, next.config.ts",
  },
  {
    requirement: "Accessibility (WCAG 2.1 AA)",
    experience: "Semantic HTML, ARIA live regions, skip-to-content, keyboard navigation, focus management, reduced motion.",
    demoLocation: "Root layout, all interactive components",
  },
  {
    requirement: "CSS & Responsive Design",
    experience: "Tailwind CSS with custom Marex brand tokens, mobile-first responsive grid, and dark/light theming foundations.",
    demoLocation: "globals.css, tailwind.config.ts",
  },
  {
    requirement: "Testing (BDD/TDD)",
    experience: "Vitest + React Testing Library with accessibility-driven selectors (getByRole), form validation, and hook lifecycle tests.",
    demoLocation: "src/__tests__/*",
  },
  {
    requirement: "CI/CD & Cloud",
    experience: "GitHub Actions pipeline (lint → type-check → test → build). Vercel deployment with preview environments.",
    demoLocation: ".github/workflows/ci.yml",
  },
  {
    requirement: "Security (OWASP)",
    experience: "CSP headers, XSS prevention via JSX escaping, server-side input validation, X-Frame-Options: DENY.",
    demoLocation: "next.config.ts, API routes",
  },
  {
    requirement: "Data Visualization",
    experience: "Recharts AreaChart for volume trends, real-time sparklines for rate cards.",
    demoLocation: "Dashboard volume chart, FX Rate cards",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">About This Project</h1>
        <p className="text-sm text-muted-foreground">
          How this application maps to the Global Payments Software Developer role requirements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            This is a mock payments orchestration dashboard demonstrating the technical skills
            required for the Global Payments squad. It features live FX rate feeds via simulated
            WebSocket, payment initiation with validation, transaction history with advanced
            table controls, and comprehensive test coverage.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Next.js 14", "TypeScript", "Tailwind CSS", "TanStack Table", "Recharts", "React Hook Form", "Zod", "Vitest"].map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <section aria-label="Skills to requirements mapping">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          JD Requirements Mapping
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {skillMapping.map((item) => (
            <Card key={item.requirement}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.requirement}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.experience}</p>
                    <p className="text-xs text-marex-accent-pink">{item.demoLocation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/danilhendrasr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-marex-accent-pink hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/danilhendrasr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-marex-accent-pink hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
