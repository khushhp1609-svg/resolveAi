export default function ChatMessage({
  from,
  children,
  resolution,
}) {
  const isAgent = from === "agent";

  const showResolution =
    isAgent &&
    resolution?.rootCause &&
    resolution?.action &&
    resolution?.result;

  return (
    <div
      className={`flex gap-3 ${
        isAgent ? "" : "flex-row-reverse"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold ${
          isAgent
            ? "bg-accent-soft text-accent-600"
            : "bg-navy-900 text-white"
        }`}
      >
        {isAgent ? "AI" : "M"}
      </div>

      {/* Message */}
      <div
        className={`max-w-[75%] ${
          isAgent ? "" : "text-right"
        }`}
      >
        <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
          {isAgent ? "ResolveAI" : "Merchant"}
        </p>

        <div
          className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
            isAgent
              ? "border border-border bg-surface text-ink shadow-sm"
              : "inline-block bg-navy-900 text-white"
          }`}
        >
          {isAgent ? (
            <div className="space-y-3">
              {/* AI response */}
              <div>{children}</div>

              {/* Structured resolution summary */}
              {showResolution && (
                <div className="border-t border-border pt-3">
                  <div className="grid gap-2 text-xs">

                    {/* Root Cause */}
                    <div className="rounded-md bg-bg-subtle px-3 py-2">
                      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                        Root Cause
                      </p>

                      <p className="mt-1 text-ink">
                        {resolution.rootCause}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="rounded-md bg-bg-subtle px-3 py-2">
                      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                        Action Taken
                      </p>

                      <p className="mt-1 text-ink">
                        {resolution.action}
                      </p>
                    </div>

                    {/* Result */}
                    <div className="rounded-md bg-accent-soft px-3 py-2">
                      <p className="font-mono text-[10px] uppercase tracking-wide text-accent-600">
                        Result
                      </p>

                      <p className="mt-1 font-medium text-ink">
                        {resolution.result}
                      </p>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}