const ROW_TONE = {
  checking: { icon: "●", color: "text-ink-soft" },
  success: { icon: "✓", color: "text-success" },
  warning: { icon: "⚠", color: "text-warning" },
  error: { icon: "✕", color: "text-danger" },
};

function Row({ label, value, state }) {
  const t = ROW_TONE[state] ?? ROW_TONE.checking;

  return (
    <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5 last:border-b-0">
      <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
        {label}
      </span>

      <span
        className={`flex items-center gap-1.5 font-mono text-sm font-medium ${t.color}`}
      >
        <span className="text-xs">{t.icon}</span>
        {value}
      </span>
    </div>
  );
}

export default function InvestigationCard({ investigation }) {
  const transactionId =
    investigation?.transaction?.transactionId || "TXN1001";

  const paymentStatus =
    investigation?.transaction?.status || "SUCCESS";

  const orderStatus =
    investigation?.order?.status || "PENDING";

  const webhookStatus =
    investigation?.webhook?.status || "FAILED";

  const paymentState =
    paymentStatus === "SUCCESS" ? "success" : "error";

  const orderState =
    orderStatus === "PAID"
      ? "success"
      : orderStatus === "PENDING"
        ? "warning"
        : "error";

  const webhookState =
    webhookStatus === "SUCCESS"
      ? "success"
      : webhookStatus === "FAILED"
        ? "error"
        : "checking";

  const resolved =
    orderStatus === "PAID" &&
    webhookStatus === "SUCCESS";

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
        <Row
          label="Transaction"
          value={transactionId}
          state="checking"
        />

        <Row
          label="Payment"
          value={paymentStatus}
          state={paymentState}
        />

        <Row
          label="Order"
          value={orderStatus}
          state={orderState}
        />

        <Row
          label="Webhook"
          value={webhookStatus}
          state={webhookState}
        />

        <Row
          label="Resolution"
          value={resolved ? "RESOLVED" : "PENDING"}
          state={resolved ? "success" : "warning"}
        />
      </div>
    </div>
  );
}