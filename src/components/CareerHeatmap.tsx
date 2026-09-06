import { useCallback, useMemo, useRef, useState } from "react";
import { roles } from "@/data/career";
import { tracks } from "@/data/profile";
import {
  buildCareerGrid,
  cellKey,
  heatColor,
  monthLabel,
  type Cell,
  type MonthKey,
} from "@/lib/careerMap";

const CELL = 15;
const GAP = 3;

type Hover = { cell: Cell; x: number; y: number } | null;

export default function CareerHeatmap() {
  const grid = useMemo(() => buildCareerGrid(), []);
  const [focusRole, setFocusRole] = useState<string | null>(null);
  const [selected, setSelected] = useState<MonthKey | null>(null);
  const [hover, setHover] = useState<Hover>(null);
  const [asTable, setAsTable] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const dim = useCallback(
    (cell: Cell) => focusRole !== null && !cell.roles.some((r) => r.id === focusRole),
    [focusRole]
  );

  const showCell = useCallback((cell: Cell, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setHover({ cell, x: r.left + r.width / 2, y: r.top });
  }, []);

  const selectedMonth = selected
    ? tracks
        .map(({ id }) => grid.cells.get(cellKey(selected, id))!)
        .filter(Boolean)
    : null;

  const activeRolesInSelected = selectedMonth
    ? [...new Map(selectedMonth.flatMap((c) => c.roles).map((r) => [r.id, r])).values()]
    : [];
  const shippedInSelected = selectedMonth
    ? [...new Set(selectedMonth.flatMap((c) => c.milestones))]
    : [];

  return (
    <div className="space-y-4">
      {/* filters */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setFocusRole(null)}
          aria-pressed={focusRole === null}
          className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors duration-150 ${
            focusRole === null
              ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
              : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
          }`}
        >
          All roles
        </button>
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setFocusRole(focusRole === r.id ? null : r.id)}
            aria-pressed={focusRole === r.id}
            className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors duration-150 ${
              focusRole === r.id
                ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
                : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
            }`}
          >
            {r.company}
          </button>
        ))}
        <button
          onClick={() => setAsTable((v) => !v)}
          className="ml-auto rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/40 transition-colors duration-150 hover:border-white/25 hover:text-white/80"
        >
          {asTable ? "Show grid" : "Show as table"}
        </button>
      </div>

      {asTable ? (
        <HeatTable grid={grid} />
      ) : (
        <div
          ref={scroller}
          className="-mx-1 overflow-x-auto px-1 pb-2 [mask-image:linear-gradient(to_right,#000_0,#000_calc(100%-32px),transparent_100%)]"
          onMouseLeave={() => setHover(null)}
        >
          <div className="inline-block min-w-full">
            {/* year ruler */}
            <div className="flex" style={{ paddingLeft: 108 }}>
              {grid.years.map((y) => (
                <div
                  key={y.year}
                  className="text-[10px] font-medium tabular-nums text-white/35"
                  style={{ width: y.span * (CELL + GAP) }}
                >
                  {y.year}
                </div>
              ))}
            </div>

            {/* rows */}
            <div className="mt-1 space-y-[3px]">
              {tracks.map((track) => (
                <div key={track.id} className="flex items-center">
                  <div
                    className="shrink-0 pr-3 text-right text-[10px] leading-none text-white/45"
                    style={{ width: 108 }}
                    title={track.blurb}
                  >
                    {track.label}
                  </div>
                  <div className="flex" style={{ gap: GAP }}>
                    {grid.months.map((m) => {
                      const cell = grid.cells.get(cellKey(m, track.id))!;
                      const dimmed = dim(cell);
                      const isSel = selected === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          aria-label={`${track.label}, ${monthLabel(m, true)}: intensity ${cell.level} of 5`}
                          onMouseEnter={(e) => showCell(cell, e.currentTarget)}
                          onFocus={(e) => showCell(cell, e.currentTarget)}
                          onBlur={() => setHover(null)}
                          onClick={() => setSelected(isSel ? null : m)}
                          className="rounded-[3px] outline-none ring-offset-2 ring-offset-[#0c0a09] transition-[transform,opacity] duration-150 hover:scale-125 focus-visible:ring-2 focus-visible:ring-amber-300 motion-reduce:transition-none motion-reduce:hover:scale-100"
                          style={{
                            width: CELL,
                            height: CELL,
                            background: heatColor(cell.level),
                            opacity: dimmed ? 0.18 : 1,
                            boxShadow: isSel ? "0 0 0 1.5px #fbbf24" : undefined,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* role span rails */}
            <div className="mt-3 space-y-[3px]">
              {roles.map((role) => {
                const first = grid.months.indexOf(role.start);
                const last = grid.months.indexOf(role.end ?? grid.now);
                if (first < 0) return null;
                const width = (last - first + 1) * (CELL + GAP) - GAP;
                const on = focusRole === null || focusRole === role.id;
                return (
                  <div key={role.id} className="flex items-center">
                    <div
                      className="shrink-0 pr-3 text-right text-[10px] leading-none text-white/30"
                      style={{ width: 108 }}
                    >
                      {on ? role.company : ""}
                    </div>
                    <div className="relative" style={{ height: 6, width: grid.months.length * (CELL + GAP) }}>
                      <div
                        className="absolute top-0 h-[6px] rounded-full transition-opacity duration-200"
                        style={{
                          left: first * (CELL + GAP),
                          width,
                          background: role.end ? "#7a4a08" : "#fbbf24",
                          opacity: on ? 0.85 : 0.12,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-white/35">
        <div className="flex items-center gap-1.5">
          <span>Quieter</span>
          {[0, 1, 2, 3, 4, 5].map((l) => (
            <span
              key={l}
              className="inline-block rounded-[3px]"
              style={{ width: 11, height: 11, background: heatColor(l) }}
            />
          ))}
          <span>Deeper</span>
        </div>
        <p className="max-w-lg leading-relaxed">
          Heat is derived, not decorative: each cell sums how hard a track was
          exercised by every role running that month, plus a point for anything
          that shipped. Overlaps burn hotter because they were.
        </p>
      </div>

      {/* month detail */}
      {selected && selectedMonth && (
        <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.04] p-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-medium text-amber-200/90">{monthLabel(selected, true)}</h3>
            <button
              onClick={() => setSelected(null)}
              className="text-[11px] text-white/40 hover:text-white/80"
            >
              close
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {activeRolesInSelected.map((r) => (
              <span
                key={r.id}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70"
              >
                {r.title} · {r.company}
              </span>
            ))}
            {activeRolesInSelected.length === 0 && (
              <span className="text-[11px] text-white/40">Nothing running this month.</span>
            )}
          </div>
          {shippedInSelected.length > 0 && (
            <ul className="mt-2 space-y-1">
              {shippedInSelected.map((s) => (
                <li key={s} className="text-[11px] leading-relaxed text-white/60">
                  <span className="text-amber-400/70">▸ </span>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {hover && !asTable && <Tooltip hover={hover} />}
    </div>
  );
}

function Tooltip({ hover }: { hover: NonNullable<Hover> }) {
  const { cell, x, y } = hover;
  const track = tracks.find((t) => t.id === cell.track)!;
  return (
    <div
      role="tooltip"
      className="pointer-events-none fixed z-50 w-60 -translate-x-1/2 -translate-y-full rounded-lg border border-white/10 bg-[#141210] p-2.5 shadow-xl shadow-black/60"
      style={{ left: x, top: y - 8 }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-medium text-white/90">{track.label}</span>
        <span className="text-[10px] tabular-nums text-white/40">{monthLabel(cell.month)}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <span
          className="inline-block rounded-[2px]"
          style={{ width: 9, height: 9, background: heatColor(cell.level) }}
        />
        <span className="text-[10px] text-white/45">intensity {cell.level}/5</span>
      </div>
      {cell.roles.length > 0 ? (
        <ul className="mt-1.5 space-y-0.5">
          {cell.roles.map((r) => (
            <li key={r.id} className="text-[10px] leading-snug text-white/60">
              {r.company}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-[10px] text-white/35">Off this track.</p>
      )}
      {cell.milestones.map((m) => (
        <p key={m} className="mt-1.5 text-[10px] leading-snug text-amber-200/80">
          ▸ {m}
        </p>
      ))}
    </div>
  );
}

function HeatTable({ grid }: { grid: ReturnType<typeof buildCareerGrid> }) {
  const rows = grid.months
    .map((m) => ({
      month: m,
      cells: tracks.map(({ id }) => grid.cells.get(cellKey(m, id))!),
    }))
    .reverse();
  return (
    <div className="max-h-96 overflow-auto rounded-lg border border-white/10">
      <table className="w-full text-left text-[11px]">
        <thead className="sticky top-0 bg-[#141210] text-white/45">
          <tr>
            <th scope="col" className="px-2 py-1.5 font-medium">Month</th>
            {tracks.map((t) => (
              <th key={t.id} scope="col" className="px-2 py-1.5 font-medium">
                {t.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white/60">
          {rows.map((r) => (
            <tr key={r.month} className="border-t border-white/5">
              <th scope="row" className="whitespace-nowrap px-2 py-1 font-normal text-white/80">
                {monthLabel(r.month)}
              </th>
              {r.cells.map((c) => (
                <td key={c.track} className="px-2 py-1 tabular-nums">
                  {c.level}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
