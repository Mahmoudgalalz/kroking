import { useEffect, useMemo, useRef, useState } from "react";
import { roles } from "@/data/career";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  href?: string;
  external?: boolean;
  run?: () => void;
};

function buildItems(toast: (m: string) => void): Item[] {
  return [
    { id: "p-home", group: "Pages", label: "Home", hint: "/", href: "/" },
    { id: "p-work", group: "Pages", label: "Career", hint: "/work", href: "/work" },
    { id: "p-proj", group: "Pages", label: "Projects", hint: "/projects", href: "/projects" },
    { id: "s-map", group: "On this page", label: "Career map", href: "/#map" },
    { id: "s-live", group: "On this page", label: "Live from GitHub", href: "/#live" },
    { id: "s-stack", group: "On this page", label: "Domains & stack", href: "/#stack" },
    { id: "s-contact", group: "On this page", label: "Get in touch", href: "/#contact" },
    ...roles.map((r) => ({
      id: `r-${r.id}`,
      group: "Roles",
      label: `${r.company}`,
      hint: `${r.title} · ${r.start.slice(0, 4)}`,
      href: `/work#${r.id}`,
    })),
    ...projects
      .filter((p) => p.featured)
      .map((p) => ({
        id: `x-${p.slug}`,
        group: "Projects",
        label: p.name,
        hint: p.blurb,
        href: p.link ?? p.github ?? "/projects",
        external: true,
      })),
    {
      id: "l-github",
      group: "Elsewhere",
      label: "GitHub",
      hint: `@${profile.github}`,
      href: profile.links.github,
      external: true,
    },
    { id: "l-in", group: "Elsewhere", label: "LinkedIn", href: profile.links.linkedin, external: true },
    { id: "l-x", group: "Elsewhere", label: "X", href: profile.links.x, external: true },
    {
      id: "a-mail",
      group: "Actions",
      label: "Copy email address",
      hint: profile.email,
      run: () => {
        navigator.clipboard?.writeText(profile.email).then(
          () => toast("Email copied"),
          () => toast(profile.email)
        );
      },
    },
    {
      id: "a-mailto",
      group: "Actions",
      label: "Write me an email",
      href: `mailto:${profile.email}`,
      external: true,
    },
  ];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () =>
      buildItems((m) => {
        setToastMsg(m);
        setTimeout(() => setToastMsg(null), 2000);
      }),
    []
  );

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i) =>
      `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(needle)
    );
  }, [items, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") setOpen(false);
      if (
        e.key === "/" &&
        !open &&
        !/^(INPUT|TEXTAREA)$/.test((e.target as HTMLElement)?.tagName ?? "")
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (item: Item) => {
    setOpen(false);
    if (item.run) return item.run();
    if (!item.href) return;
    if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
    else window.location.assign(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      choose(results[active]);
    }
  };

  let lastGroup = "";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40 transition-colors duration-150 hover:border-white/25 hover:text-white/80"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="max-sm:hidden">Jump to…</span>
        <kbd className="rounded border border-white/15 px-1 font-sans text-[9px] max-sm:hidden">⌘K</kbd>
      </button>

      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-md border border-amber-400/30 bg-[#141210] px-3 py-1.5 text-[11px] text-amber-200 shadow-lg"
        >
          {toastMsg}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#141210] shadow-2xl shadow-black/70"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search pages, roles, projects…"
              className="w-full border-b border-white/10 bg-transparent px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/25"
            />
            <div ref={listRef} className="max-h-80 overflow-y-auto p-1.5">
              {results.length === 0 && (
                <p className="px-3 py-6 text-center text-xs text-white/30">Nothing matches that.</p>
              )}
              {results.map((item, i) => {
                const header = item.group !== lastGroup ? ((lastGroup = item.group), item.group) : null;
                return (
                  <div key={item.id}>
                    {header && (
                      <div className="px-2.5 pb-1 pt-2.5 text-[9px] uppercase tracking-widest text-white/25">
                        {header}
                      </div>
                    )}
                    <button
                      data-active={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(item)}
                      className={`flex w-full items-baseline gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] ${
                        i === active ? "bg-amber-400/10 text-amber-100" : "text-white/70"
                      }`}
                    >
                      <span className="shrink-0">{item.label}</span>
                      {item.hint && (
                        <span className="min-w-0 truncate text-[10px] text-white/30">{item.hint}</span>
                      )}
                      {item.external && (
                        <span className="ml-auto shrink-0 text-[9px] text-white/20">↗</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 border-t border-white/10 px-3 py-1.5 text-[9px] text-white/25">
              <span>↑↓ move</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
