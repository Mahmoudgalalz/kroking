import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { fetchRepos, relativeTime, type GhRepo } from "@/lib/github";

export default function LiveRepos({ limit = 8 }: { limit?: number }) {
  const [repos, setRepos] = useState<GhRepo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetchRepos()
      .then((r) =>
        setRepos(
          r
            .filter((x) => !x.fork && !x.archived)
            .sort((a, b) => (a.pushed_at < b.pushed_at ? 1 : -1))
            .slice(0, limit)
        )
      )
      .catch(() => setFailed(true));
  }, [limit]);

  if (failed)
    return (
      <p className="text-[11px] text-white/35">
        GitHub is rate-limiting anonymous requests right now —{" "}
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400/70 hover:underline"
        >
          browse the repos directly
        </a>
        .
      </p>
    );

  if (!repos)
    return (
      <div className="grid gap-1.5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-lg border border-white/[0.05] bg-white/[0.015] motion-safe:animate-pulse"
          />
        ))}
      </div>
    );

  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {repos.map((r) => (
        <li key={r.id}>
          <a
            href={r.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full flex-col rounded-lg border border-white/[0.06] bg-white/[0.015] px-2.5 py-2 transition-colors duration-200 hover:border-amber-400/25 hover:bg-white/[0.04]"
          >
            <div className="flex items-baseline gap-2">
              <span className="truncate text-xs text-white/85">{r.name}</span>
              {r.stargazers_count > 0 && (
                <span className="shrink-0 text-[10px] tabular-nums text-amber-400/60">
                  ★ {r.stargazers_count}
                </span>
              )}
              <span className="ml-auto shrink-0 text-[9px] tabular-nums text-white/25">
                {relativeTime(r.pushed_at)}
              </span>
            </div>
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-white/40">
              {r.description ?? "No description — the code is the description."}
            </p>
            {r.language && <span className="mt-1 text-[9px] text-white/25">{r.language}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
