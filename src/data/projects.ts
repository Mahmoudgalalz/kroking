import type { DomainId } from "./profile";

export type Project = {
  slug: string;
  name: string;
  blurb: string;
  description: string;
  featured: boolean;
  domains: DomainId[];
  company?: string;
  role?: string;
  link?: string;
  github?: string;
  favicon?: string;
  stack: string[];
  metrics?: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "crcl",
    name: "CRCL",
    blurb: "Events platform, architected and led end-to-end",
    description:
      "Architected CRCL and led a team of four to build it. I owned the core API — ticketing, event lifecycle, payments — and the decisions underneath it.",
    featured: true,
    domains: ["commerce", "fintech"],
    role: "Architect · Team lead",
    link: "https://crclevents.com",
    favicon: "https://crclevents.com/favicon.ico",
    stack: ["TypeScript", "NestJS", "PostgreSQL", "Redis", "AWS"],
    metrics: [
      { label: "Active users / mo", value: "20K+" },
      { label: "Revenue / mo", value: "$10K+" },
      { label: "Events created", value: "50+" },
    ],
  },
  {
    slug: "hi-new",
    name: "hi.new",
    blurb: "A preprocessor for your inbox — allowlists, paywalls, spam",
    description:
      "Same mailbox, a much quieter inbox. hi.new sits in front of your email with allowlists, paywalls and spam filtering. It reached #3 Product of the Day on Product Hunt.",
    featured: true,
    domains: ["devtools", "security"],
    company: "Onboardbase",
    link: "https://hi.new",
    favicon: "https://hi.new/img/favicon.png",
    stack: ["TypeScript", "NestJS", "Nuxt", "Cloudflare Workers"],
    metrics: [
      { label: "Visitors / mo", value: "5K+" },
      { label: "Registrations", value: "1K+" },
      { label: "Spam blocked", value: "10K+" },
    ],
  },
  {
    slug: "salamy",
    name: "Salamy.Space",
    blurb: "First specialised mental-health platform in MENA",
    description:
      "Designed from a blank page: stack choice, infrastructure, cost model, and the team that kept it running. Serves the MENA region at six figures of monthly readership.",
    featured: true,
    domains: ["health"],
    company: "Dbrandria",
    role: "Architect",
    link: "https://salamy.space",
    favicon: "https://salamy.space/favicon.png",
    stack: ["Next.js", "Strapi", "Nginx", "Ansible", "GitHub Actions"],
    metrics: [
      { label: "Visitors / mo", value: "100K+" },
      { label: "Articles", value: "2K+" },
    ],
  },
  {
    slug: "fomotechno",
    name: "fomotechno",
    blurb: "Mentoring platform, architecture to production",
    description:
      "Built a mentoring platform for a client from architecture through to production and handover.",
    featured: true,
    domains: ["gov"],
    link: "https://fomotechno.org",
    favicon: "https://fomotechno.org/favicon.ico",
    stack: ["TypeScript", "Next.js", "PostgreSQL"],
    metrics: [
      { label: "Visitors / mo", value: "5K+" },
      { label: "Registrations", value: "1K+" },
    ],
  },
  {
    slug: "og-service",
    name: "Open Graph service",
    blurb: "Dynamic OG image microservice used by 20+ sites",
    description:
      "One small service that renders social preview images on demand. Built once at Dbrandria, then reused across more than twenty properties.",
    featured: true,
    domains: ["devtools"],
    company: "Dbrandria",
    stack: ["Node.js", "Nginx", "Docker"],
    metrics: [{ label: "Sites served", value: "20+" }],
  },
  {
    slug: "surge-action",
    name: "surge-action",
    blurb: "GitHub Action for client-side deploys via Surge.sh",
    description: "Automates client-side deployment straight from a workflow file.",
    featured: false,
    domains: ["devtools"],
    github: "https://github.com/mahmoudgalalz/surge-action",
    stack: ["GitHub Actions", "Shell"],
  },
  {
    slug: "nudgeer-safe",
    name: "nudgeer-safe",
    blurb: "Construct security headers in seconds",
    description: "A small library for composing correct security headers without re-reading the spec.",
    featured: false,
    domains: ["security"],
    github: "https://github.com/Onboardbase/nudgeer-safe",
    stack: ["TypeScript"],
  },
  {
    slug: "nudgeer-action",
    name: "nudgeer-action",
    blurb: "Security headers as a smoke test in CI",
    description: "Fails the build when your deployed headers regress.",
    featured: false,
    domains: ["security", "devtools"],
    github: "https://github.com/Onboardbase/nudgeer-action",
    stack: ["GitHub Actions", "TypeScript"],
  },
  {
    slug: "global-env",
    name: "global-env",
    blurb: "Update environment variables at runtime",
    description: "Swap configuration under a running process without a redeploy.",
    featured: false,
    domains: ["devtools"],
    github: "https://github.com/Onboardbase/global-env",
    stack: ["TypeScript"],
  },
  {
    slug: "ghtop",
    name: "ghtop",
    blurb: "A worked example of doing rate-limiting properly",
    description: "Reference implementation I keep pointing people at when they get 403s from an API.",
    featured: false,
    domains: ["devtools"],
    github: "https://github.com/Mahmoudgalalz/ghtop",
    stack: ["Go"],
  },
  {
    slug: "bash-util",
    name: "bash-util",
    blurb: "The scripts I actually run every day",
    description:
      "Automating a two-minute task with a script that took five hours. Worth it every time.",
    featured: false,
    domains: ["devtools"],
    github: "https://github.com/Mahmoudgalalz/bash-util",
    stack: ["Shell"],
  },
];

export const featured = projects.filter((p) => p.featured);
export const tools = projects.filter((p) => !p.featured);
