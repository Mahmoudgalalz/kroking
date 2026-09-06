import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  where: string;
  href: string;
};

const stats: Stat[] = [
  { value: 90, suffix: "%", label: "execution time cut", where: "TrustyCollectors", href: "/work#trusty" },
  { value: 40, suffix: "%", label: "cloud spend cut", where: "Scout", href: "/work#scout" },
  { value: 60, prefix: "$", suffix: "K+", label: "deals unblocked", where: "Onboardbase", href: "/work#onboardbase" },
  { value: 100, suffix: "K+", label: "users on infra I ran", where: "Dbrandria", href: "/work#dbrandria" },
  { value: 99.99, suffix: "%", label: "SLO on event pipelines", where: "Manara", href: "/work#manara" },
  { value: 10, suffix: "min", label: "provisioning, down from 2 days", where: "Onboardbase", href: "/work#onboardbase" },
];

export default function Impact() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return setRun(true);
    const el = ref.current;
    if (!el) return;
    const io: IntersectionObserver = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setRun(true), io.disconnect()),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {stats.map((s) => (
        <a
          key={s.label}
          href={s.href}
          className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 transition-colors duration-200 hover:border-amber-400/25"
        >
          <div className="text-xl font-semibold tabular-nums leading-none text-amber-200/90">
            {s.prefix}
            <Count to={s.value} run={run} />
            <span className="text-sm">{s.suffix}</span>
          </div>
          <div className="mt-1 text-[11px] leading-tight text-white/55">{s.label}</div>
          <div className="mt-0.5 text-[9px] text-white/25">{s.where}</div>
        </a>
      ))}
    </div>
  );
}

function Count({ to, run }: { to: number; run: boolean }) {
  const [n, setN] = useState(0);
  const decimals = to % 1 === 0 ? 0 : 2;

  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(to);
    const dur = 900;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);

  return <>{n.toFixed(decimals)}</>;
}
