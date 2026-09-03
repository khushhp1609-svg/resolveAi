
export default function MemoryCard({ memory }) {
  const incident = memory?.activeIncident;

  if (!incident) {
    return (
      <div className="ml-10 max-w-md rounded-lg border border-border bg-bg-subtle px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
          Memory
        </p>

        <p className="mt-1.5 text-sm text-ink">
          No previous related incident found
        </p>
      </div>
    );
  }

  const incidentId = incident.incidentId || "INC10291";

  const displayIncidentId = incidentId.startsWith("INC")
    ? incidentId.replace("INC", "INC-")
    : incidentId;

  const status =
    incident.status === "RESOLVED"
      ? "Resolved"
      : incident.status;

  const statusDate = incident.updatedAt
    ? new Date(incident.updatedAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })
    : "";

  const incidentType =
    incident.type === "PAYMENT_ORDER_MISMATCH"
      ? "Payment/order mismatch"
      : incident.type || "Payment incident";

  const resolution =
    incident.resolution ||
    "Incident investigation is in progress";

  return (
    <div className="ml-10 max-w-md rounded-lg border border-accent/25 bg-accent-soft px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-wide text-accent-600">
        Memory
      </p>

      <p className="mt-1.5 text-sm text-ink">
        Previous related incident found
      </p>

      <div className="mt-2 rounded-md border border-accent/20 bg-surface px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs font-medium text-ink">
            {displayIncidentId}
          </span>

          <span className="font-mono text-[11px] text-ink-soft">
            {status}
            {statusDate ? ` ${statusDate}` : ""}
          </span>
        </div>

        <p className="mt-1 text-xs text-ink-soft">
          {incidentType}
        </p>

        <p className="mt-1.5 text-xs text-accent-600">
          {resolution}
        </p>
      </div>
    </div>
  );
}
