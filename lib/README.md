This folder contains all backend business logic.

Rules:
- API routes must not contain business logic
- AI integrations live only in /lib/ai
- Database access lives only in /lib/db
- Analytics logic lives only in /lib/analytics
- Services orchestrate logic, not routes

This separation ensures testability, explainability, and AI provider independence.
