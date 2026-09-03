import StatusBadge from "./StatusBadge";

export default function IncidentHeader({
  title,
  caseId,
  tone,
  statusLabel,
}) {
  return (
    <div className="border-b border-border bg-surface px-5 py-4 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-lg font-semibold text-ink">
            {title}
          </h1>

          <p className="mt-0.5 font-mono text-xs text-ink-soft">
            {caseId}
          </p>
        </div>

        <StatusBadge
          tone={tone}
          className="rounded-full border border-border bg-bg px-3 py-1"
        >
          {statusLabel}
        </StatusBadge>
      </div>
    </div>
  );
}