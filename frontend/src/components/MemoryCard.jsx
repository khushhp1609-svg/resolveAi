export default function MemoryCard() {
  return (
    <div className="ml-10 max-w-md rounded-lg border border-accent/25 bg-accent-soft px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-wide text-accent-600">Memory</p>
      <p className="mt-1.5 text-sm text-ink">Previous related incident found</p>
      <div className="mt-2 rounded-md border border-accent/20 bg-surface px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium text-ink">INC-10291</span>
          <span className="font-mono text-[11px] text-ink-soft">Resolved Aug 28</span>
        </div>
        <p className="mt-1 text-xs text-ink-soft">Payment/order mismatch</p>
        <p className="mt-1.5 text-xs text-accent-600">Webhook failure → replayed successfully</p>
      </div>
    </div>
  );
}
