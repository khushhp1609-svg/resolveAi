import StatusBadge from "./StatusBadge";

/**
 * Compact "● Investigating" style indicator, for spots where we only need
 * the raw status signal (not a full badge with a background pill).
 */
export default function IncidentStatus({ tone, children }) {
  return <StatusBadge tone={tone}>{children}</StatusBadge>;
}
