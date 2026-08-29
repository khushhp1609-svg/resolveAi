import { useState } from "react";

/**
 * UI-only input. Appends the message to a local list so the workspace feels
 * alive during a demo, but nothing is sent to the backend yet — that arrives
 * with the AI agent in a later phase.
 */
export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="border-t border-border bg-surface px-5 py-4 lg:px-8">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 focus-within:border-accent">
        <button
          type="button"
          className="shrink-0 rounded p-1 text-ink-soft hover:text-ink"
          aria-label="Attach"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10.5 5.5 6 10a1.8 1.8 0 1 0 2.5 2.5l4.5-4.5a3 3 0 1 0-4.2-4.2L4.3 8.3"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Describe your payment issue..."
          className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-navy-900 text-white transition-colors hover:bg-navy-800 disabled:opacity-40"
          disabled={!value.trim()}
          aria-label="Send"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M2 7.5 13 2 8.5 13l-2-4.5L2 7.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  );
}
