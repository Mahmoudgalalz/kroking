import { profile } from "@/data/profile";

const USER = profile.github;
const TTL = 10 * 60 * 1000; // 10 minutes — GitHub allows 60 unauthenticated calls/hour/IP

function cacheGet<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    if (Date.now() - at > TTL) return null;
    return data as T;
  } catch {
    return null;
  }
}

function cacheSet(key: string, data: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* private mode, quota — not worth failing over */
  }
}

async function get<T>(url: string, key: string, force = false): Promise<T> {
  if (!force) {
    const hit = cacheGet<T>(key);
    if (hit) return hit;
  }
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const data = (await res.json()) as T;
  cacheSet(key, data);
  return data;
}

export type GhUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
};

export type GhRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
  owner: { login: string };
};

export type GhEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: Record<string, any>;
};

export type ContribDay = { date: string; count: number; level: number };
export type ContribYear = { total: Record<string, number>; contributions: ContribDay[] };

export const fetchUser = (force?: boolean) =>
  get<GhUser>(`https://api.github.com/users/${USER}`, "gh:user", force);

export const fetchRepos = (force?: boolean) =>
  get<GhRepo[]>(
    `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`,
    "gh:repos",
    force
  );

export const fetchEvents = (force?: boolean) =>
  get<GhEvent[]>(
    `https://api.github.com/users/${USER}/events/public?per_page=40`,
    "gh:events",
    force
  );

/**
 * GitHub's contribution calendar is GraphQL-only and needs a token, which a
 * static site can't hold. This public mirror serves the same numbers.
 */
export const fetchContributions = (force?: boolean) =>
  get<ContribYear>(
    `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`,
    "gh:contrib",
    force
  );

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.round(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.round(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(mo / 12)}y ago`;
}

/** Turn a raw GitHub event into a sentence a human wants to read. */
export function describeEvent(e: GhEvent): { verb: string; detail: string } | null {
  const repo = e.repo?.name ?? "";
  switch (e.type) {
    case "PushEvent": {
      const n = e.payload?.commits?.length ?? e.payload?.size ?? 0;
      const msg = e.payload?.commits?.[0]?.message?.split("\n")[0];
      return {
        verb: `pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}`,
        detail: msg ?? "",
      };
    }
    case "CreateEvent":
      return { verb: `created ${e.payload?.ref_type ?? "something"} in ${repo}`, detail: e.payload?.ref ?? "" };
    case "PullRequestEvent":
      return {
        verb: `${e.payload?.action ?? "updated"} a pull request in ${repo}`,
        detail: e.payload?.pull_request?.title ?? "",
      };
    case "IssuesEvent":
      return {
        verb: `${e.payload?.action ?? "updated"} an issue in ${repo}`,
        detail: e.payload?.issue?.title ?? "",
      };
    case "IssueCommentEvent":
      return { verb: `commented in ${repo}`, detail: e.payload?.issue?.title ?? "" };
    case "WatchEvent":
      return { verb: `starred ${repo}`, detail: "" };
    case "ForkEvent":
      return { verb: `forked ${repo}`, detail: "" };
    case "ReleaseEvent":
      return { verb: `released ${e.payload?.release?.tag_name ?? ""} in ${repo}`, detail: "" };
    case "PublicEvent":
      return { verb: `open-sourced ${repo}`, detail: "" };
    default:
      return null;
  }
}

/** Longest run of consecutive days with at least one contribution, ending today. */
export function currentStreak(days: ContribDay[]): number {
  const today = new Date().toISOString().slice(0, 10);
  const sorted = [...days].filter((d) => d.date <= today).sort((a, b) => (a.date < b.date ? 1 : -1));
  let streak = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].count > 0) streak++;
    else if (i === 0) continue; // today may not have landed yet
    else break;
  }
  return streak;
}

export function longestStreak(days: ContribDay[]): number {
  let best = 0;
  let run = 0;
  for (const d of [...days].sort((a, b) => (a.date < b.date ? -1 : 1))) {
    if (d.count > 0) {
      run++;
      if (run > best) best = run;
    } else run = 0;
  }
  return best;
}
