import { useEffect, useState } from "react";
import { roles, type Role } from "@/data/career";
import { domains } from "@/data/profile";
import { monthLabel } from "@/lib/careerMap";

const kindStyle: Record<Role["kind"], string> = {
  founding: "border-amber-400/40 text-amber-300/90",
  lead: "border-amber-400/30 text-amber-200/70",
  contract: "border-white/15 text-white/45",
  "full-time": "border-white/10 text-white/35",
};

function duration(role: Role): string {
  const start = new Date(role.start + "-01");
  const end = role.end ? new Date(role.end + "-01") : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y}y`, m && `${m}mo`].filter(Boolean).join(" ") || "1mo";
}

export default function Timeline() {
  const [open, setOpen] = useState<string | null>(roles[0].id);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (roles.some((r) => r.id === hash)) {
      setOpen(hash);
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <ol className="relative space-y-2 border-l border-white/[0.08] pl-5">
      {roles.map((role) => {
        const isOpen = open === role.id;
        return (
          <li key={role.id} id={role.id} className="relative scroll-mt-24">
            <span
              className="absolute -left-[25px] top-4 h-2 w-2 rounded-full ring-4 ring-[#0c0a09]"
              style={{ background: role.end ? "#7a4a08" : "#fbbf24" }}
            />
            <div
              className={`rounded-lg border transition-colors duration-200 ${
                isOpen ? "border-white/[0.12] bg-white/[0.03]" : "border-white/[0.06] bg-white/[0.015]"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : role.id)}
                aria-expanded={isOpen}
                className="w-full px-3 py-2.5 text-left"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="text-sm text-white/90">
                    {role.title}
                    <span className="text-white/30"> at </span>
                    {role.url ? (
                      <span className="text-amber-200/90">{role.company}</span>
                    ) : (
                      <span className="text-amber-200/90">{role.company}</span>
                    )}
                  </h3>
                  <span
                    className={`rounded-full border px-1.5 py-px text-[9px] uppercase tracking-wide ${kindStyle[role.kind]}`}
                  >
                    {role.kind}
                  </span>
                  {!role.end && (
                    <span className="rounded-full bg-amber-400/15 px-1.5 py-px text-[9px] text-amber-300">
                      now
                    </span>
                  )}
                  <span className="ml-auto shrink-0 text-[10px] tabular-nums text-white/30">
                    {monthLabel(role.start)} → {role.end ? monthLabel(role.end) : "present"} ·{" "}
                    {duration(role)}
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-white/30">{role.location}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/55">{role.summary}</p>
                {!isOpen && (
                  <span className="mt-1.5 inline-block text-[10px] text-amber-400/50">
                    {role.highlights.length} things I shipped →
                  </span>
                )}
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-white/[0.06] px-3 py-3">
                  <ul className="space-y-1.5">
                    {role.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed text-white/60">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-400/50" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1">
                    {role.domains.map((d) => (
                      <span
                        key={d}
                        className="rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-1.5 py-px text-[10px] text-amber-200/70"
                      >
                        {domains.find((x) => x.id === d)?.label ?? d}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-px text-[10px] text-white/45"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {role.url && (
                    <a
                      href={role.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[10px] text-white/35 hover:text-amber-300"
                    >
                      {role.url.replace("https://", "")} ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
