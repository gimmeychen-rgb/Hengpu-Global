# Hengpu Platform Roadmap

## Roadmap Principles

- Stabilize platform foundations before expanding business scope.
- Keep each phase shippable and measurable.
- Add workflow depth before adding AI.
- Treat trust, auditability, and role-based governance as core platform assets.
- Avoid full microservice complexity until domain boundaries and operational practices are proven.

## Phase 1: Industrial Supply Chain

Goal:

Build the core industrial supply chain marketplace around buyers, suppliers, requests, matching, and projects.

Foundation work:

- Harden auth and authorization.
- Add API gateway or BFF.
- Add migrations, tests, logs, health checks, and CI.
- Add supplier profile depth: capabilities, certifications, regions served, product catalog.
- Add buyer organization profiles.
- Add request lifecycle: draft, open, matching, shortlisted, closed.
- Add match explanation and scoring versioning.
- Add admin verification workflow.

Key deliverables:

- Production-ready account and role model.
- Supplier onboarding and verification.
- Buyer request management.
- Rule-based matching with auditable score components.
- Admin operations panel.
- Trust score event ledger.

## Phase 2: Mining Collaboration

Goal:

Support mining-specific collaboration where projects require stronger compliance, documentation, geography, and operational coordination.

Foundation work:

- Extend category model beyond enum into configurable verticals.
- Add mining project profiles: mineral type, location, volume, timeline, license requirements.
- Add document management for permits, certifications, and technical specs.
- Add compliance checklist workflows.
- Add project milestone tracking.
- Add role model for agents, inspectors, and external reviewers.

Key deliverables:

- Mining request templates.
- Supplier capability matching for mining equipment, logistics, and services.
- Compliance evidence tracking.
- Project milestone and status history.
- Mining-specific admin review workflows.

## Phase 3: CRM

Goal:

Add relationship management for buyers, suppliers, agents, government contacts, and enterprise accounts.

Foundation work:

- Introduce organization/account model separate from user identity.
- Add contacts, notes, activities, tasks, and follow-ups.
- Add pipeline stages for supply opportunities and strategic partnerships.
- Add ownership and team assignment.
- Add audit history for CRM changes.

Key deliverables:

- Organization and contact database.
- Account timeline.
- Task and follow-up system.
- Sales/project pipeline.
- Admin visibility into relationships and engagement.

## Phase 4: ERP

Goal:

Add operational enterprise workflows around orders, inventory, procurement, invoices, and delivery coordination.

Foundation work:

- Define ERP domain boundaries separately from marketplace matching.
- Add product master data and SKU management.
- Add purchase order and sales order workflows.
- Add warehouse/inventory records.
- Add invoice and payment status tracking without implementing payments prematurely.
- Add integration boundaries for external ERP/accounting systems.

Key deliverables:

- Product catalog and SKU model.
- Purchase orders.
- Supplier quotations.
- Delivery and fulfillment tracking.
- ERP integration API.
- Reporting read models.

## Phase 5: Government Cooperation

Goal:

Support regulated cooperation with government bodies, public-sector projects, policy programs, and compliance reporting.

Foundation work:

- Strengthen audit logs and data retention.
- Add government organization and role types.
- Add project approval workflows.
- Add policy/program records.
- Add compliance reports and exportable evidence packs.
- Add permission boundaries for public-sector users.

Key deliverables:

- Government partner profiles.
- Public-sector project workflows.
- Approval and review trails.
- Compliance dashboards.
- Secure report exports.
- Data governance policies.

## Phase 6: AI Services

Goal:

Use AI to improve matching, supplier discovery, document analysis, risk scoring, and operational recommendations after strong data foundations exist.

Prerequisites:

- Stable domain data.
- Auditable matching history.
- Clean supplier and request taxonomies.
- Document storage and metadata.
- Consent, governance, and data retention policies.
- Human review workflows.

AI opportunities:

- Supplier recommendation ranking.
- Request enrichment and category suggestion.
- Document extraction for certificates and permits.
- Risk scoring for projects and counterparties.
- CRM follow-up recommendations.
- ERP demand forecasting.
- Multilingual communication assistance.

Key deliverables:

- AI-assisted matching with explainability.
- Document intelligence pipeline.
- Human-in-the-loop review tools.
- Model evaluation and feedback loop.
- AI governance and audit documentation.

## Cross-Phase Platform Initiatives

Phase 1:

- Auth hardening, migrations, tests, logging, CI, gateway.

Phase 2:

- Document management, compliance workflows, richer project model.

Phase 3:

- Organization model, activity timeline, task system.

Phase 4:

- Product/order/inventory foundations and integration layer.

Phase 5:

- Governance, reporting, approval workflows, retention policy.

Phase 6:

- AI data pipelines, evaluation, explainability, and human review.

## Recommended Sequencing

1. Stabilize platform foundations.
2. Finish industrial supply chain workflows.
3. Add mining-specific depth as the first vertical.
4. Add CRM to manage relationships created by marketplace activity.
5. Add ERP after order/project operations become repeatable.
6. Add government cooperation once audit and compliance capabilities are mature.
7. Add AI services after enough high-quality operational data exists.
