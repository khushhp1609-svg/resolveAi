
import StatusBadge from "./StatusBadge";

function Section({ title, children }) {
  return (
    <div className="border-b border-border px-5 py-4 last:border-b-0">
      <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-ink-soft">{label}</span>
      <span className="font-mono text-xs font-medium text-ink">
        {value}
      </span>
    </div>
  );
}

export default function ContextPanel({ memory }) {
  const incident = memory?.activeIncident;

  const incidentId = incident?.incidentId || "INC10291";

  const displayIncidentId = incidentId.startsWith("INC")
    ? incidentId.replace("INC", "INC-")
    : incidentId;

  const incidentStatus =
    incident?.status === "RESOLVED"
      ? "Resolved"
      : "Investigating";

  const priority =
    incident?.priority
      ? incident.priority.charAt(0) +
        incident.priority.slice(1).toLowerCase()
      : "High";

  const transactionId =
    incident?.transactionId || "TXN1001";

  const amount = incident?.description?.match(
    /Rs\s?([\d,]+)/
  )?.[1];

  return (
    <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-border bg-surface xl:block">
      <Section title="Incident">
        <Field
          label="ID"
          value={displayIncidentId}
        />

        <Field
          label="Status"
          value={incidentStatus}
        />

        <Field
          label="Priority"
          value={priority}
        />
      </Section>

      <Section title="Transaction">
        <Field
          label="ID"
          value={transactionId}
        />

        <Field
          label="Amount"
          value={amount ? `₹${amount}` : "₹5,000"}
        />

        <Field
          label="Method"
          value="UPI"
        />
      </Section>

      <Section title="Memory">
        <Field
          label="Related incidents"
          value={incident ? "1 found" : "None"}
        />
      </Section>

      <Section title="System">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-soft">
              API
            </span>
            <StatusBadge tone="operational" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-soft">
              Database
            </span>
            <StatusBadge tone="connected" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-soft">
              AI Agent
            </span>
            <StatusBadge tone="operational" />
          </div>
        </div>
      </Section>
    </aside>
  );
}
