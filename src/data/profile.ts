export const profile = {
  name: "Mahmoud Galal",
  handle: "kroking",
  github: "mahmoudgalalz",
  title: "Senior Backend / Platform Engineer",
  tagline:
    "I design, build and scale distributed systems — usually as the first backend engineer in the room.",
  location: "Cairo, Egypt",
  openTo: "Remote · US / EU / Gulf",
  email: "krooking0@gmail.com",
  site: "kroking.dev",
  summary: [
    "Senior Backend / Platform Engineer with a founding-engineer mindset. I take backend architecture end-to-end: the RFC, the schema, the queues, the Terraform, the on-call runbook.",
    "Most of my work lives where money, security and scale meet — payment reconciliation, secrets rotation, multi-tenant integration hubs, event-driven order systems.",
    "I optimise for cost as much as latency. Cutting a cloud bill 40% and cutting p99 35% are the same kind of work.",
  ],
  links: {
    github: "https://github.com/mahmoudgalalz",
    linkedin: "https://linkedin.com/in/mahmoudgalalz",
    x: "https://links.kroking.dev/x",
  },
} as const;

export type Track = "backend" | "infra" | "data" | "security" | "lead" | "oss";

export const tracks: { id: Track; label: string; blurb: string }[] = [
  { id: "backend", label: "Backend & APIs", blurb: "REST/GraphQL, event-driven services, async workflows" },
  { id: "infra", label: "Cloud & Infra", blurb: "AWS, Azure, Terraform, Kubernetes, CI/CD" },
  { id: "data", label: "Data & Search", blurb: "PostgreSQL, Redis, ElasticSearch, vector + RAG" },
  { id: "security", label: "Security", blurb: "Secrets, encryption, auth, RBAC, supply chain" },
  { id: "lead", label: "Leadership & DX", blurb: "RFCs, mentoring, sprint ownership, developer experience" },
  { id: "oss", label: "Open Source", blurb: "SDKs, GitHub Actions, dev tooling, workshops" },
];

export const domains = [
  { id: "fintech", label: "Fintech & Payments", note: "Reconciliation, collections, banking portals" },
  { id: "devtools", label: "Developer Tools", note: "SDKs, CLIs, GitHub Actions, deploy tooling" },
  { id: "security", label: "Security", note: "Secrets management, rotation, header hardening" },
  { id: "commerce", label: "Commerce & Procurement", note: "OMS, storefronts, purchase orders, SAP" },
  { id: "ai", label: "AI & Search", note: "Vector search, RAG ingestion pipelines" },
  { id: "health", label: "Healthcare", note: "MENA mental-health platform at 100K+ users" },
  { id: "gov", label: "Gov & Enterprise", note: "CAPMAS data infra, client portals, ERP" },
] as const;

export type DomainId = (typeof domains)[number]["id"];
