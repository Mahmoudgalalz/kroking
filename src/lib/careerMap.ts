import { roles, milestones, type Role } from "@/data/career";
import { tracks, type Track } from "@/data/profile";

export type MonthKey = string; // YYYY-MM

export function monthKey(d: Date): MonthKey {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function parseMonth(m: MonthKey): Date {
  const [y, mo] = m.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, 1));
}

export function monthLabel(m: MonthKey, long = false): string {
  return parseMonth(m).toLocaleDateString("en-US", {
    month: long ? "long" : "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function monthRange(from: MonthKey, to: MonthKey): MonthKey[] {
  const out: MonthKey[] = [];
  const end = parseMonth(to);
  const cur = parseMonth(from);
  while (cur <= end) {
    out.push(monthKey(cur));
    cur.setUTCMonth(cur.getUTCMonth() + 1);
  }
  return out;
}

/** Months a role covers, clamped to `now` when open-ended. */
export function roleMonths(role: Role, now: MonthKey): MonthKey[] {
  return monthRange(role.start, role.end ?? now);
}

export function isRoleActive(role: Role, month: MonthKey, now: MonthKey): boolean {
  return month >= role.start && month <= (role.end ?? now);
}

export type Cell = {
  month: MonthKey;
  track: Track;
  /** raw weight sum across concurrent roles + milestone boost */
  score: number;
  /** 0–5 bucket used for colour */
  level: number;
  roles: Role[];
  milestones: string[];
};

export type CareerGrid = {
  months: MonthKey[];
  years: { year: string; span: number }[];
  cells: Map<string, Cell>;
  max: number;
  now: MonthKey;
};

export const cellKey = (month: MonthKey, track: Track) => `${month}|${track}`;

/**
 * Heat is derived, not invented: for each (month, track) we sum the track weight
 * of every role running that month, then add +1 if something shipped that month.
 */
export function buildCareerGrid(now = monthKey(new Date())): CareerGrid {
  const start = roles.reduce((a, r) => (r.start < a ? r.start : a), roles[0].start);
  const lastEnd = roles.reduce((a, r) => {
    const e = r.end ?? now;
    return e > a ? e : a;
  }, now);
  const months = monthRange(start, lastEnd > now ? lastEnd : now);

  const cells = new Map<string, Cell>();
  let max = 0;

  for (const month of months) {
    const active = roles.filter((r) => isRoleActive(r, month, now));
    const shipped = milestones.filter((m) => m.month === month);
    for (const { id: track } of tracks) {
      let score = 0;
      const contributing: Role[] = [];
      for (const role of active) {
        const w = role.weights[track] ?? 0;
        if (w > 0) {
          score += w;
          contributing.push(role);
        }
      }
      const labels = shipped
        .filter((m) => contributing.some((r) => r.id === m.roleId))
        .map((m) => m.label);
      if (score > 0) score += labels.length;
      if (score > max) max = score;
      cells.set(cellKey(month, track), {
        month,
        track,
        score,
        level: 0,
        roles: contributing,
        milestones: labels,
      });
    }
  }

  // Bucket into 5 levels once the max is known, so the ramp always uses its full range.
  for (const cell of cells.values()) {
    cell.level = cell.score === 0 ? 0 : Math.max(1, Math.ceil((cell.score / max) * 5));
  }

  const years: { year: string; span: number }[] = [];
  for (const m of months) {
    const y = m.slice(0, 4);
    const last = years[years.length - 1];
    if (last && last.year === y) last.span += 1;
    else years.push({ year: y, span: 1 });
  }

  return { months, years, cells, max, now };
}

/**
 * Sequential amber ramp. Validated on the #0c0a09 surface: OKLCH lightness is
 * monotonic and every adjacent step clears ΔE 8 (OKLab ×100), so the common
 * mid buckets stay recessive and the rare peaks actually read as peaks.
 */
export const HEAT = ["#1c1917", "#3a2405", "#633c06", "#a56b0b", "#e09b12", "#fbbf24"];

export function heatColor(level: number): string {
  return HEAT[Math.min(Math.max(level, 0), 5)];
}

/** Total months worked, counting overlapping roles once. */
export function totalActiveMonths(now = monthKey(new Date())): number {
  const set = new Set<MonthKey>();
  for (const r of roles) for (const m of roleMonths(r, now)) set.add(m);
  return set.size;
}

/** Months where more than one role was running at the same time. */
export function overlappingMonths(now = monthKey(new Date())): number {
  const counts = new Map<MonthKey, number>();
  for (const r of roles) for (const m of roleMonths(r, now)) counts.set(m, (counts.get(m) ?? 0) + 1);
  return [...counts.values()].filter((n) => n > 1).length;
}
