const TONES = {
  open: { dot: "bg-accent", text: "text-accent-600", label: "Open" },
  investigating: { dot: "bg-warning", text: "text-warning", label: "Investigating" },
  resolved: { dot: "bg-success", text: "text-success", label: "Resolved" },
  escalated: { dot: "bg-danger", text: "text-danger", label: "Escalated" },
  connected: { dot: "bg-success", text: "text-success", label: "Connected" },
  operational: { dot: "bg-success", text: "text-success", label: "Operational" },
  offline: { dot: "bg-danger", text: "text-danger", label: "Not configured" },
};

/**
 * Small dot + label used everywhere we surface a case or system state.
 * `tone` maps to a semantic color; `children` overrides the default label text.
 */
export default function StatusBadge({ tone = "open", children, className = "" }) {
  const t = TONES[tone] ?? TONES.open;
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide ${t.text} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {children ?? t.label}
    </span>
  );
}
