const ROW_TONE = {
  checking: { icon: "●", color: "text-ink-soft", ring: "" },
  success: { icon: "✓", color: "text-success", ring: "" },
  warning: { icon: "⚠", color: "text-warning", ring: "" },
  error: { icon: "✕", color: "text-danger", ring: "" },
};

function Row({ label, value, state }) {
  const t = ROW_TONE[state] ?? ROW_TONE.checking;
  return (
    <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5 last:border-b-0">
      <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">{label}</span>
      <span className={`flex items-center gap-1.5 font-mono text-sm font-medium ${t.color}`}>
        <span className="text-xs">{t.icon}</span>
        {value}
      </span>
    </div>
  );
}

export default function InvestigationCard() {
  return (
    <div className="ml-10 max-w-md overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between bg-bg-subtle px-4 py-2.5">
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-ink">
          Investigation
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
          Evidence collected
        </span>
      </div>
      <div>
        <Row label="Transaction" value="TXN1001" state="checking" />
        <Row label="Payment" value="Success" state="success" />
        <Row label="Order" value="Pending" state="warning" />
        <Row label="Webhook" value="Failed" state="error" />
      </div>
    </div>
  );
}
