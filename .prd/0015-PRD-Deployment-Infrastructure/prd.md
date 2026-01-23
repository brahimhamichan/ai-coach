# PRD: Deployment & Infrastructure

## 1. Executive Summary
Define the production environment, CI/CD pipeline, and monitoring strategy to ensure the ADHD AI Coach is reliable, performant, and secure for public use.

## 2. Problem Statement
Manual deployments are error-prone. Without proper monitoring and environment management, we risk downtime or leaking sensitive API keys (Vapi, OpenAI, Convex).

## 3. Goals & Success Metrics
- **Goal**: 100% automated deployments.
- **Metric**: Zero manual "production" changes.
- **Goal**: 99.9% availability.
- **Metric**: Uptime tracking via external monitoring.
- **Goal**: Secure secret management.
- **Metric**: No secrets committed to git.

## 4. Functional Requirements
- **REQ-001: Automated CI/CD**: Use GitHub Actions to run tests and deploy to Vercel/Convex.
- **REQ-002: Environment Segregation**: Distinct "Development," "Staging," and "Production" environments.
- **REQ-003: Monitoring & Logging**: Integration with Sentry or similar for error tracking.
- **REQ-004: Custom Domain & SSL**: Secure `aicoach.scalingadventures.com` (or similar) with HTTPS.

## 5. Technical Considerations
- **Hosting**: Vercel for Frontend/Next.js.
- **Backend**: Convex (Production instance).
- **Secrets**: Vercel Environment Variables + Convex Dashboard Secrets.
- **Testing**: Playwright E2E tests must pass before production deployment.

## 6. Implementation Roadmap
1. Set up Production project in Convex and Vercel.
2. Configure GitHub Actions for linting and testing.
3. Automate `npx convex deploy` on merge to `main`.
4. Set up basic monitoring and error alerts.
