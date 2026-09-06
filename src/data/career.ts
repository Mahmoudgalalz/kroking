import type { DomainId, Track } from "./profile";

export type Role = {
  id: string;
  company: string;
  url?: string;
  title: string;
  kind: "full-time" | "contract" | "founding" | "lead";
  location: string;
  /** inclusive, YYYY-MM */
  start: string;
  /** inclusive, YYYY-MM — null means still running */
  end: string | null;
  summary: string;
  domains: DomainId[];
  /** how much each track was exercised in this role, 0–3 */
  weights: Partial<Record<Track, number>>;
  highlights: string[];
  stack: string[];
};

/** Ordered newest-first. */
export const roles: Role[] = [
  {
    id: "penny",
    company: "Penny.co",
    url: "https://penny.co",
    title: "Senior Backend Engineer",
    kind: "full-time",
    location: "KSA · Remote",
    start: "2026-01",
    end: null,
    summary:
      "Owning a multi-tenant Integration Hub that replaced a paid third-party iPaaS and removed backend code changes from every new customer integration.",
    domains: ["commerce", "gov", "security"],
    weights: { backend: 3, infra: 2, data: 1, security: 3, lead: 2 },
    highlights: [
      "Authored the RFC for a standalone NestJS Integration Hub, consolidating integration logic that had been scattered across branches and retiring a paid third-party platform (Prismatic).",
      "Architected org-scoped configuration with a Chain of Responsibility pattern and a decorator-based handler registry — the same integration runs per-tenant field mappings, credentials and feature flags through config, not code.",
      "Built bidirectional flows: outbound over RabbitMQ events, inbound over normalized HTTP callbacks, with exponential-backoff retries, alerting, AES-256 credential encryption and per-org observability.",
      "Shipped SAP integration services syncing Purchase Requisitions, Vendor/Business Partner records and RFQs via CQRS handlers over RabbitMQ with durable queues, message TTLs and dead-letter exchanges.",
      "Secured integration endpoints with NestJS guards enforcing org-code and per-tenant bearer validation, documented in Swagger/OpenAPI and validated with class-validator DTOs.",
      "Closed ~140 of 158 Dependabot alerts via targeted npm overrides and Python upgrades, and migrated the spreadsheet engine from xlsx to exceljs to kill a ReDoS vulnerability.",
    ],
    stack: ["TypeScript", "NestJS", "Node.js", "RabbitMQ", "CQRS", "PostgreSQL", "OpenAPI", "Docker", "Kubernetes", "SAP S/4HANA", "Odoo", "OpenText"],
  },
  {
    id: "naseh",
    company: "Naseh.qa",
    url: "https://naseh.qa",
    title: "Lead Software Engineer",
    kind: "lead",
    location: "Qatar · Remote",
    start: "2025-09",
    end: "2026-01",
    summary:
      "Led a four-engineer team through a five-repo consolidation and a full JavaScript → TypeScript migration on Azure.",
    domains: ["gov", "commerce"],
    weights: { backend: 2, infra: 3, lead: 3, data: 1 },
    highlights: [
      "Consolidated 5 independent repositories into a single TypeScript monorepo, cutting build and deployment times by 40%.",
      "Migrated a large client portal from JavaScript to TypeScript, reducing production bugs through shared tooling and strict typing.",
      "Managed and mentored 4 engineers — sprint planning, code review and stakeholder alignment, delivering ahead of schedule.",
      "Optimised Azure Kubernetes Service and automated CI/CD, enabling 2× faster feature delivery.",
    ],
    stack: ["TypeScript", "Node.js", "React", "Next.js", "Express", "MongoDB", "AKS", "Docker", "GitHub Actions", "Turborepo", "Redis", "Nginx", "WebSockets"],
  },
  {
    id: "scout",
    company: "Scout",
    title: "Senior Backend Engineer — Founding",
    kind: "founding",
    location: "USA · Remote · Contract",
    start: "2025-06",
    end: "2025-12",
    summary:
      "Founding backend/platform engineer: OMS, multi-vendor storefront and internal services from zero to production on serverless AWS.",
    domains: ["commerce", "ai"],
    weights: { backend: 3, infra: 3, data: 3, security: 2, lead: 2 },
    highlights: [
      "Built the OMS, a multi-vendor storefront and internal services from zero to production, supporting 10K+ products and complex procurement workflows.",
      "Owned cloud architecture end-to-end — serverless AWS designed in Terraform with CI/CD — reaching a 30–40% cloud cost reduction while keeping iteration fast and safe.",
      "Implemented core domain systems (Purchase Orders, authentication, async workflows) in TypeScript, cutting critical-path latency ~35%.",
      "Architected a shared Identity Provider giving secure auth, RBAC and SSO across multiple platforms.",
      "Built AI-powered ingestion and search pipelines on ElasticSearch vectorization + RAG, improving relevance and cutting query response times ~40%.",
    ],
    stack: ["TypeScript", "AWS Lambda", "API Gateway", "S3", "CloudWatch", "Terraform", "Serverless", "ElasticSearch", "Vector Search", "RAG", "Event-Driven", "IAM"],
  },
  {
    id: "trusty",
    company: "TrustyCollectors",
    title: "Senior Software Engineer",
    kind: "full-time",
    location: "Cairo, Egypt",
    start: "2024-10",
    end: "2025-12",
    summary:
      "Financial modules, payment reconciliation and a testing strategy that took a legacy NestJS backend from fragile to boring.",
    domains: ["fintech"],
    weights: { backend: 3, infra: 1, data: 2, security: 1, lead: 2 },
    highlights: [
      "Engineered RESTful APIs following Zalando guidelines across 4+ critical financial modules, accelerating cross-team integration.",
      "Led performance refactors in a TypeScript/NestJS backend for a 90% reduction in execution time, via background job queues and optimised PostgreSQL queries.",
      "Designed a testing strategy covering 100% of system functionality and held 95%+ automated coverage.",
      "Architected payment reconciliation algorithms that prevented 33% of potential commission losses, recovering six-figure annual revenue.",
    ],
    stack: ["TypeScript", "NestJS", "ASP.NET 8", "PostgreSQL", "Redis", "AWS", "Nginx", "GitHub Actions", "ArgoCD", "Jest"],
  },
  {
    id: "manara",
    company: "Manara.tech",
    url: "https://manara.tech",
    title: "Software Engineer — Contract",
    kind: "contract",
    location: "USA · Remote",
    start: "2024-07",
    end: "2024-09",
    summary:
      "Event-driven microservices on AWS that replaced manual approval workflows.",
    domains: ["commerce", "gov"],
    weights: { backend: 3, infra: 2 },
    highlights: [
      "Built event-driven microservices on AWS SQS, Lambda and EventBridge to a 99.99% SLO.",
      "Automated manual approval workflows, cutting processing time by ~490%.",
      "Shipped core product features improving candidate assessment and UX.",
    ],
    stack: ["TypeScript", "Node.js", "Next.js", "AWS SQS", "Lambda", "RDS", "SQL", "OAuth", "HubSpot"],
  },
  {
    id: "onboardbase",
    company: "Onboardbase",
    url: "https://onboardbase.com",
    title: "Software Engineer — Platform / R&D",
    kind: "full-time",
    location: "USA · Remote",
    start: "2023-08",
    end: "2025-07",
    summary:
      "Two years of platform R&D in secrets management — SDKs, encryption, rotation, and the deploy tooling around it. Most of my open source comes from here.",
    domains: ["devtools", "security"],
    weights: { backend: 2, infra: 2, security: 3, lead: 1, oss: 3 },
    highlights: [
      "Led R&D and built multiple SDKs, improving developer experience and integration success rates by 88%.",
      "Delivered experimental features that helped close $60K+ in new deals.",
      "Built a secrets rotation and encryption system for MySQL and MariaDB, improving customer security posture by 33%.",
      "Designed an internal Ansible-like deployment tool, taking environment provisioning from 1–2 days to under 10 minutes — a 120% productivity gain.",
    ],
    stack: ["TypeScript", "NestJS", "Next.js", "Vue", "Nuxt", "Kubernetes", "Docker", "Redis", "Prometheus", "Rust", "Go", "C++", "Linux"],
  },
  {
    id: "dbrandria",
    company: "Dbrandria",
    title: "Software Engineer",
    kind: "full-time",
    location: "Cairo, Egypt",
    start: "2023-08",
    end: "2024-06",
    summary:
      "First job. Legacy PHP for an Islamic bank, a mental-health platform built from scratch, and infra for 100K+ users.",
    domains: ["fintech", "health", "gov"],
    weights: { backend: 3, infra: 2, data: 1, lead: 1 },
    highlights: [
      "Refactored legacy PHP systems for Albaraka Islamic Bank, improving performance and code quality.",
      "Reduced initial page load from 35s to 3s through caching and performance work.",
      "Designed and built Salamy.Space, making the architectural decisions from scratch.",
      "Managed infrastructure for a 100K+ user platform and built a reusable Open Graph image microservice used across 20+ websites.",
    ],
    stack: ["JavaScript", "PHP", "Laravel", "Java", "Spring Boot", "Next.js", "NestJS", "Nginx", "Ansible", "GitHub Actions"],
  },
];

export type Milestone = {
  /** YYYY-MM */
  month: string;
  roleId: string;
  label: string;
};

/** Dated shipping events. These add heat on top of role weights. */
export const milestones: Milestone[] = [
  { month: "2023-09", roleId: "dbrandria", label: "Albaraka Bank portal: 35s → 3s first load" },
  { month: "2023-11", roleId: "dbrandria", label: "Salamy.Space architecture signed off" },
  { month: "2024-01", roleId: "onboardbase", label: "First public SDK shipped" },
  { month: "2024-02", roleId: "dbrandria", label: "Open Graph image microservice — 20+ sites" },
  { month: "2024-04", roleId: "onboardbase", label: "Secrets rotation for MySQL / MariaDB" },
  { month: "2024-06", roleId: "dbrandria", label: "Salamy.Space live, 100K+ users" },
  { month: "2024-08", roleId: "manara", label: "EventBridge approval pipeline at 99.99% SLO" },
  { month: "2024-11", roleId: "trusty", label: "Zalando-style API guidelines adopted" },
  { month: "2025-02", roleId: "trusty", label: "Job-queue refactor: 90% execution time cut" },
  { month: "2025-04", roleId: "onboardbase", label: "Ansible-like deploy tool: 2 days → 10 min" },
  { month: "2025-05", roleId: "trusty", label: "Reconciliation algorithm recovers six figures" },
  { month: "2025-07", roleId: "scout", label: "Serverless AWS foundation in Terraform" },
  { month: "2025-08", roleId: "scout", label: "Shared IdP with RBAC + SSO" },
  { month: "2025-10", roleId: "scout", label: "Vector search + RAG ingestion, −40% query time" },
  { month: "2025-11", roleId: "naseh", label: "5 repos → 1 monorepo, −40% build time" },
  { month: "2025-12", roleId: "scout", label: "OMS to production, 10K+ products" },
  { month: "2026-02", roleId: "penny", label: "Integration Hub RFC published" },
  { month: "2026-04", roleId: "penny", label: "SAP S/4HANA sync live over CQRS + RabbitMQ" },
  { month: "2026-06", roleId: "penny", label: "140 of 158 Dependabot alerts closed" },
];

export const education = {
  degree: "B.Sc. Computer Science",
  school: "Modern Academy, Egypt",
  gpa: "3.42 / 4.0",
  notes: [
    "Led workshops on Open Source, Git and OSS contribution.",
    "Mentored students with 44 documented OSS success stories.",
  ],
};
