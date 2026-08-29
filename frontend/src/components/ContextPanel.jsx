import StatusBadge from "./StatusBadge";

function Section({ title, children }) {
  return (
    <div className="border-b border-border px-5 py-4 last:border-b-0">
      <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-ink-soft">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-ink-soft">{label}</span>
      <span className="font-mono text-xs font-medium text-ink">{value}</span>
    </div>
  );
}

export default function ContextPanel() {
  return (
    <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-border bg-surface xl:block">
      <Section title="Incident">
        <Field label="ID" value="INC-10291" />
        <Field label="Status" value="Investigating" />
        <Field label="Priority" value="High" />
      </Section>

      <Section title="Transaction">
        <Field label="ID" value="TXN1001" />
        <Field label="Amount" value="₹5,000" />
        <Field label="Method" value="UPI" />
      </Section>

      <Section title="Memory">
        <Field label="Related incidents" value="1 found" />
      </Section>

      <Section title="System">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-soft">API</span>
            <StatusBadge tone="operational" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-soft">Database</span>
            <StatusBadge tone="connected" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-soft">AI Agent</span>
            <StatusBadge tone="offline" />
          </div>
        </div>
      </Section>
    </aside>
  );
}
