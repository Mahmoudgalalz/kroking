import { useState } from "react";
import CommandPalette from "./CommandPalette";
import { profile } from "@/data/profile";

const pages = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Career" },
  { href: "/projects", label: "Projects" },
];

export default function Nav({ path }: { path: string }) {
  const here = path.replace(/\/$/, "") || "/";
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] pb-4">
      <a href="/" className="group flex items-center gap-2.5">
        <Avatar />
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-white/90">
            {profile.name}{" "}
            <span className="font-normal text-white/30">
              aka <span className="text-amber-400/80">kroking</span>
            </span>
          </span>
          <span className="block text-[11px] text-white/40">{profile.title}</span>
        </span>
      </a>

      <nav className="ml-auto flex items-center gap-1" aria-label="Primary">
        {pages.map((p) => {
          const active = here === p.href;
          return (
            <a
              key={p.href}
              href={p.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 ${
                active ? "bg-white/10 text-white/90" : "text-white/45 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              {p.label}
            </a>
          );
        })}
        <CommandPalette />
      </nav>
    </header>
  );
}

/** GitHub's avatar CDN isn't reachable everywhere — fall back to an initial. */
function Avatar() {
  const [dead, setDead] = useState(false);
  const ring =
    "h-10 w-10 shrink-0 rounded-full ring-1 ring-white/10 transition-shadow duration-200 group-hover:ring-amber-400/40";

  if (dead)
    return (
      <span
        className={`${ring} grid place-items-center bg-amber-400/10 text-sm font-semibold text-amber-300`}
        aria-hidden="true"
      >
        K
      </span>
    );

  return (
    <img
      src={`https://github.com/${profile.github}.png`}
      alt=""
      width={40}
      height={40}
      onError={() => setDead(true)}
      ref={(el) => el?.complete && el.naturalWidth === 0 && setDead(true)}
      className={ring}
    />
  );
}
