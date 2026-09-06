import { useMemo, useState } from "react";
import { roles } from "@/data/career";
import { projects } from "@/data/projects";
import { domains, type DomainId } from "@/data/profile";

const CATEGORIES: { label: string; match: string[] }[] = [
  {
    label: "Languages",
    match: ["TypeScript", "JavaScript", "Go", "Rust", "C++", "Java", "PHP", "SQL", "Shell"],
  },
  {
    label: "Backend & frameworks",
    match: [
      "NestJS", "Node.js", "Next.js", "Express", "Nuxt", "Vue", "React", "Laravel",
      "Spring Boot", "ASP.NET 8", "Strapi", "Serverless", "OpenAPI", "OAuth", "IAM",
      "Event-Driven", "CQRS", "RabbitMQ", "AWS SQS", "Lambda", "AWS Lambda", "API Gateway",
      "WebSockets", "RAG",
    ],
  },
  {
    label: "Data & search",
    match: ["PostgreSQL", "MongoDB", "Redis", "ElasticSearch", "Vector Search", "RDS", "S3", "Cosmos DB"],
  },
  {
    label: "Cloud & ops",
    match: [
      "AWS", "Azure", "AKS", "Kubernetes", "Docker", "Terraform", "Ansible", "Nginx",
      "GitHub Actions", "ArgoCD", "Turborepo", "CloudWatch", "Cloudflare Workers",
      "Prometheus", "Jest", "Linux",
    ],
  },
];

function categoryOf(tech: string): string {
  return CATEGORIES.find((c) => c.match.includes(tech))?.label ?? "Domain & product";
}

type Entry = {
  tech: string;
  roles: typeof roles;
  projects: typeof projects;
  domains: Set<DomainId>;
};

function buildIndex(): Entry[] {
  const map = new Map<string, Entry>();
  const touch = (tech: string) => {
    const key = tech.trim();
    if (!map.has(key))
      map.set(key, { tech: key, roles: [], projects: [], domains: new Set() });
    return map.get(key)!;
  };
  for (const r of roles)
    for (const t of r.stack) {
      const e = touch(t);
      e.roles.push(r);
      r.domains.forEach((d) => e.domains.add(d));
    }
  for (const p of projects)
    for (const t of p.stack) {
      const e = touch(t);
      e.projects.push(p);
      p.domains.forEach((d) => e.domains.add(d));
    }
  return [...map.values()].sort(
    (a, b) =>
      b.roles.length + b.projects.length - (a.roles.length + a.projects.length) ||
      a.tech.localeCompare(b.tech)
  );
}

export default function StackMap() {
  const index = useMemo(buildIndex, []);
  const [domain, setDomain] = useState<DomainId | null>(null);
  const [tech, setTech] = useState<string | null>(null);

  const selected = tech ? index.find((e) => e.tech === tech) ?? null : null;
  const matches = (e: Entry) => domain === null || e.domains.has(domain);

  const grouped = useMemo(() => {
    const order = [...CATEGORIES.map((c) => c.label), "Domain & product"];
    const buckets = new Map<string, Entry[]>();
    for (const e of index) {
      const c = categoryOf(e.tech);
      if (!buckets.has(c)) buckets.set(c, []);
      buckets.get(c)!.push(e);
    }
    return order
      .filter((c) => buckets.has(c))
      .map((c) => [c, buckets.get(c)!] as const);
  }, [index]);

  const domainRoles = domain ? roles.filter((r) => r.domains.includes(domain)) : [];
  const domainProjects = domain ? projects.filter((p) => p.domains.includes(domain)) : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {domains.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setDomain(domain === d.id ? null : d.id);
              setTech(null);
            }}
            aria-pressed={domain === d.id}
            title={d.note}
            className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors duration-150 ${
              domain === d.id
                ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
                : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {domain && (
        <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.04] px-3 py-2 text-[11px] leading-relaxed text-white/60">
          <span className="text-amber-200/90">
            {domains.find((d) => d.id === domain)!.note}
          </span>
          {domainRoles.length > 0 && (
            <>
              {" — "}
              {domainRoles.map((r, i) => (
                <span key={r.id}>
                  {i > 0 && ", "}
                  <a href={`/work#${r.id}`} className="text-white/80 underline-offset-2 hover:underline">
                    {r.company}
                  </a>
                </span>
              ))}
            </>
          )}
          {domainProjects.length > 0 && (
            <>
              {" · "}
              {domainProjects.map((p, i) => (
                <span key={p.slug} className="text-white/45">
                  {i > 0 && ", "}
                  {p.name}
                </span>
              ))}
            </>
          )}
        </div>
      )}

      <div className="space-y-2.5">
        {grouped.map(([label, entries]) => (
          <div key={label} className="flex gap-3 max-sm:flex-col max-sm:gap-1">
            <h3 className="shrink-0 pt-0.5 text-[10px] uppercase tracking-widest text-white/25 sm:w-28 sm:text-right">
              {label}
            </h3>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {entries.map((e) => {
                const on = matches(e);
                const isSel = tech === e.tech;
                const weight = e.roles.length + e.projects.length;
                return (
                  <button
                    key={e.tech}
                    onClick={() => setTech(isSel ? null : e.tech)}
                    aria-pressed={isSel}
                    className={`rounded-md border px-2 py-0.5 text-[11px] transition-colors duration-150 ${
                      isSel
                        ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
                        : on
                          ? "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white/90"
                          : "border-white/[0.04] text-white/20"
                    }`}
                  >
                    {e.tech}
                    {weight > 2 && (
                      <span className="ml-1 text-[9px] text-amber-400/50">×{weight}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-[11px] leading-relaxed">
          <h3 className="text-xs font-medium text-white/85">
            {selected.tech}
            <span className="ml-2 font-normal text-white/35">
              {selected.roles.length} role{selected.roles.length === 1 ? "" : "s"}
              {selected.projects.length > 0 &&
                ` · ${selected.projects.length} project${selected.projects.length === 1 ? "" : "s"}`}
            </span>
          </h3>
          <ul className="mt-1.5 space-y-1">
            {selected.roles.map((r) => (
              <li key={r.id}>
                <a href={`/work#${r.id}`} className="text-white/70 hover:text-amber-300">
                  {r.company}
                </a>
                <span className="text-white/30"> · {r.title} · {r.start} → {r.end ?? "now"}</span>
              </li>
            ))}
            {selected.projects.map((p) => (
              <li key={p.slug} className="text-white/45">
                {p.name} <span className="text-white/25">— {p.blurb}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
