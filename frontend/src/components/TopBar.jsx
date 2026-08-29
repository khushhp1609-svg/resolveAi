import StatusBadge from "./StatusBadge";

export default function TopBar({ onMenuClick }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-ink-soft hover:bg-bg-subtle lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <span className="font-display text-sm font-semibold text-ink">
          Merchant Workspace
        </span>
      </div>
      <StatusBadge tone="connected">System Ready</StatusBadge>
    </header>
  );
}
