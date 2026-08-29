import StatusBadge from "./StatusBadge";

const RECENT_CASES = [
  {
    id: "INC-10291",
    title: "Payment / Order mismatch",
    tone: "open",
    date: "Aug 28",
    active: true,
  },
  {
    id: "INC-10277",
    title: "Settlement delayed",
    tone: "resolved",
    date: "Aug 27",
    active: false,
  },
  {
    id: "INC-10254",
    title: "KYC verification",
    tone: "open",
    date: "Aug 25",
    active: false,
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 flex h-full w-72 shrink-0 flex-col bg-navy-900 text-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* brand */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent font-display text-sm font-bold text-white">
            R
          </div>
          <div>
            <p className="font-display text-[15px] font-semibold leading-none">ResolveAI</p>
            <p className="mt-1 text-[11px] leading-none text-navy-600" style={{ color: "#8992a8" }}>
              Merchant Incident Resolution
            </p>
          </div>
        </div>

        {/* new case */}
        <div className="px-4">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-md border border-navy-600 bg-navy-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-700"
          >
            <span className="text-base leading-none">+</span> New Case
          </button>
        </div>

        {/* recent cases */}
        <div className="mt-6 flex-1 overflow-y-auto px-4">
          <p className="mb-2 px-1 font-mono text-[11px] uppercase tracking-wider text-navy-600" style={{ color: "#69738c" }}>
            Active Cases
          </p>
          <ul className="space-y-1">
            {RECENT_CASES.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`w-full rounded-md px-3 py-2.5 text-left transition-colors ${
                    c.active ? "bg-navy-800" : "hover:bg-navy-800/60"
                  }`}
                >
                  <p className="text-sm font-medium text-white/90">{c.title}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <StatusBadge tone={c.tone} />
                    <span className="font-mono text-[11px]" style={{ color: "#69738c" }}>
                      {c.date}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* footer */}
        <div className="border-t border-navy-700 px-5 py-4">
          <p className="font-mono text-[11px]" style={{ color: "#69738c" }}>
            Phase 1 · Infrastructure only
          </p>
        </div>
      </aside>
    </>
  );
}
