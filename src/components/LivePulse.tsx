import { useCallback, useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { heatColor } from "@/lib/careerMap";
import {
  currentStreak,
  describeEvent,
  fetchContributions,
  fetchEvents,
  fetchUser,
  longestStreak,
  relativeTime,
  type ContribDay,
  type ContribYear,
  type GhEvent,
  type GhUser,
} from "@/lib/github";

type State = {
  user: GhUser | null;
  contrib: ContribYear | null;
  events: GhEvent[] | null;
  error: string | null;
  loading: boolean;
  at: number | null;
};

const empty: State = { user: null, contrib: null, events: null, error: null, loading: true, at: null };

export default function LivePulse() {
  const [s, setS] = useState<State>(empty);

  const load = useCallback(async (force = false) => {
    setS((p) => ({ ...p, loading: true }));
    const [user, contrib, events] = await Promise.all([
      fetchUser(force).catch(() => null),
      fetchContributions(force).catch(() => null),
      fetchEvents(force).catch(() => null),
    ]);
    setS({
      user,
      contrib,
      events,
      loading: false,
      at: Date.now(),
      error: !user && !contrib && !events ? "GitHub is not answering right now." : null,
    });
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(() => load(true), 5 * 60 * 1000);
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const days = s.contrib?.contributions ?? [];
  const total = days.reduce((a, d) => a + d.count, 0);
  const feed = (s.events ?? [])
    .map((e) => ({ e, d: describeEvent(e) }))
    .filter((x): x is { e: GhEvent; d: NonNullable<ReturnType<typeof describeEvent>> } => !!x.d)
    .slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60 motion-safe:animate-ping ${
              s.error ? "hidden" : ""
            }`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              s.error ? "bg-white/25" : "bg-amber-400"
            }`}
          />
        </span>
        <span className="text-[11px] text-white/45">
          {s.error ? "offline" : "live"}
        </span>
        <button
          onClick={() => load(true)}
          className="ml-auto text-[10px] text-white/30 transition-colors hover:text-white/70"
        >
          {s.loading ? "syncing…" : s.at ? `synced ${relativeTime(new Date(s.at).toISOString())}` : "refresh"}
        </button>
      </div>

      {s.error && (
        <p className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[11px] text-white/45">
          {s.error} It rate-limits anonymous callers at 60 requests an hour —{" "}
          <a
            className="text-amber-400/70 underline-offset-2 hover:underline"
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            the profile itself
          </a>{" "}
          is still there.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Contributions / yr" value={total || null} loading={s.loading} />
        <Stat label="Public repos" value={s.user?.public_repos ?? null} loading={s.loading} />
        <Stat label="Followers" value={s.user?.followers ?? null} loading={s.loading} />
        <Stat
          label="Current streak"
          value={days.length ? currentStreak(days) : null}
          suffix="d"
          loading={s.loading}
        />
      </div>

      {days.length > 0 && <ContributionGrid days={days} />}

      {feed.length > 0 && (
        <ul className="space-y-1.5">
          {feed.map(({ e, d }) => (
            <li key={e.id} className="flex gap-2 text-[11px] leading-relaxed">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-amber-400/50" />
              <span className="min-w-0 flex-1">
                <a
                  href={`https://github.com/${e.repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 transition-colors hover:text-amber-300"
                >
                  {d.verb}
                </a>
                {d.detail && <span className="text-white/35"> — {d.detail}</span>}
              </span>
              <span className="shrink-0 tabular-nums text-white/25">{relativeTime(e.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  suffix = "",
  loading,
}: {
  label: string;
  value: number | null;
  suffix?: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2">
      <div className="text-lg font-semibold tabular-nums leading-tight text-white/90">
        {value === null ? (
          <span className={`text-white/20 ${loading ? "motion-safe:animate-pulse" : ""}`}>—</span>
        ) : (
          <>
            {value.toLocaleString()}
            <span className="text-xs font-normal text-white/40">{suffix}</span>
          </>
        )}
      </div>
      <div className="text-[10px] leading-tight text-white/35">{label}</div>
    </div>
  );
}

function ContributionGrid({ days }: { days: ContribDay[] }) {
  const [hover, setHover] = useState<{ d: ContribDay; x: number; y: number } | null>(null);

  // Pad to whole weeks starting Sunday, exactly like GitHub's calendar.
  const sorted = [...days].sort((a, b) => (a.date < b.date ? -1 : 1));
  const lead = new Date(sorted[0].date + "T00:00:00Z").getUTCDay();
  const cells: (ContribDay | null)[] = [...Array(lead).fill(null), ...sorted];
  const weeks: (ContribDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const monthTicks: { i: number; label: string }[] = [];
  weeks.forEach((w, i) => {
    const first = w.find(Boolean);
    if (!first) return;
    const d = new Date(first.date + "T00:00:00Z");
    if (d.getUTCDate() > 7) return;
    const label = d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    if (monthTicks[monthTicks.length - 1]?.label === label) return;
    monthTicks.push({ i, label });
  });

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-1" onMouseLeave={() => setHover(null)}>
        <div className="inline-block">
          <div className="relative mb-1 h-3" style={{ width: weeks.length * 13 }}>
            {monthTicks.map((t) => (
              <span
                key={t.i}
                className="absolute text-[9px] text-white/30"
                style={{ left: t.i * 13 }}
              >
                {t.label}
              </span>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((w, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {w.map((d, di) =>
                  d ? (
                    <button
                      key={d.date}
                      type="button"
                      aria-label={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
                      onMouseEnter={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        setHover({ d, x: r.left + r.width / 2, y: r.top });
                      }}
                      onFocus={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        setHover({ d, x: r.left + r.width / 2, y: r.top });
                      }}
                      onBlur={() => setHover(null)}
                      className="h-[10px] w-[10px] rounded-[2px] outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                      style={{ background: heatColor(d.count === 0 ? 0 : Math.min(d.level + 1, 5)) }}
                    />
                  ) : (
                    <span key={`e${wi}-${di}`} className="h-[10px] w-[10px]" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {hover && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-white/10 bg-[#141210] px-2 py-1 text-[10px] text-white/80 shadow-lg shadow-black/60"
          style={{ left: hover.x, top: hover.y - 6 }}
        >
          <b className="font-medium">{hover.d.count}</b> contribution
          {hover.d.count === 1 ? "" : "s"}{" "}
          <span className="text-white/40">
            ·{" "}
            {new Date(hover.d.date + "T00:00:00Z").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })}
          </span>
        </div>
      )}
      <p className="mt-1 text-[10px] text-white/25">
        Longest streak {longestStreak(days)} days · fetched live on page load
      </p>
    </div>
  );
}
