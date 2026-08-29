export default function ChatMessage({ from, children }) {
  const isAgent = from === "agent";
  return (
    <div className={`flex gap-3 ${isAgent ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold ${
          isAgent ? "bg-accent-soft text-accent-600" : "bg-navy-900 text-white"
        }`}
      >
        {isAgent ? "AI" : "M"}
      </div>
      <div className={`max-w-[75%] ${isAgent ? "" : "text-right"}`}>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
          {isAgent ? "ResolveAI" : "Merchant"}
        </p>
        <div
          className={`inline-block rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
            isAgent
              ? "border border-border bg-surface text-ink"
              : "bg-navy-900 text-white"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
