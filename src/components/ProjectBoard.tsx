import { useEffect, useRef, useState } from "react";
import { featured, tools } from "@/data/projects";
import { domains, type DomainId } from "@/data/profile";

const allDomains = domains.filter((d) =>
  [...featured, ...tools].some((p) => p.domains.includes(d.id))
);

export default function ProjectBoard({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<DomainId | null>(null);
  const show = (ds: readonly DomainId[]) => filter === null || ds.includes(filter);
  const shownFeatured = featured.filter((p) => show(p.domains));
  const shownTools = tools.filter((p) => show(p.domains));

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter(null)}
            aria-pressed={filter === null}
            className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors duration-150 ${
              filter === null
                ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
                : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
            }`}
          >
            Everything
          </button>
          {allDomains.map((d) => (
            <button
              key={d.id}
              onClick={() => setFilter(filter === d.id ? null : d.id)}
              aria-pressed={filter === d.id}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors duration-150 ${
                filter === d.id
                  ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
                  : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {(compact ? shownFeatured.slice(0, 4) : shownFeatured).map((p) => (
          <article
            key={p.slug}
            className="group flex flex-col rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 transition-colors duration-200 hover:border-amber-400/25"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm text-white/90">
                  {p.name}
                  {p.company && <span className="text-white/30"> · {p.company}</span>}
                </h3>
                <p className="mt-0.5 text-[10px] text-white/35">{p.role ?? p.blurb}</p>
              </div>
              {p.favicon && <Favicon src={p.favicon} />}
            </div>

            <p className="mt-2 flex-1 text-xs leading-relaxed text-white/55">{p.description}</p>

            {p.metrics && (
              <dl className="mt-2.5 flex flex-wrap gap-1.5">
                {p.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded border border-white/[0.07] bg-white/[0.03] px-2 py-1"
                  >
                    <dd className="text-xs font-semibold tabular-nums text-amber-200/90">{m.value}</dd>
                    <dt className="text-[9px] leading-tight text-white/30">{m.label}</dt>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-2.5 flex flex-wrap gap-1">
              {p.stack.slice(0, 5).map((t) => (
                <span key={t} className="text-[9px] text-white/25">
                  {t}
                </span>
              ))}
            </div>

            {(p.link || p.github) && (
              <div className="mt-2 flex gap-3 text-[10px]">
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/45 hover:text-amber-300"
                  >
                    {p.link.replace("https://", "")} ↗
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/45 hover:text-amber-300"
                  >
                    source ↗
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {!compact && shownTools.length > 0 && (
        <>
          <h3 className="pt-2 text-[11px] uppercase tracking-widest text-white/25">
            Small things, open sourced
          </h3>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {shownTools.map((p) => (
              <li key={p.slug}>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col rounded-lg border border-white/[0.06] bg-white/[0.015] px-2.5 py-2 transition-colors duration-200 hover:border-amber-400/25 hover:bg-white/[0.04]"
                >
                  <span className="text-xs text-white/80">{p.name}</span>
                  <span className="mt-0.5 text-[11px] leading-relaxed text-white/40">{p.blurb}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {shownFeatured.length === 0 && shownTools.length === 0 && (
        <p className="text-xs text-white/30">Nothing in that domain yet.</p>
      )}
    </div>
  );
}

/**
 * Third-party favicons 404 more often than you'd think. The image is server-rendered,
 * so a load failure can happen before React hydrates and onError never fires — check
 * the element's own state on mount as well.
 */
function Favicon({ src }: { src: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setDead(true);
  }, []);

  if (dead) return null;
  return (
    <img
      ref={ref}
      src={src}
      alt=""
      loading="lazy"
      onError={() => setDead(true)}
      className="h-7 w-7 shrink-0 rounded opacity-50 transition-opacity duration-200 group-hover:opacity-90"
    />
  );
}
