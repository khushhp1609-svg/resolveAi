import { useEffect, useState } from "react";
import { checkBackendHealth } from "../services/api";

/**
 * Tracks whether the Express backend is reachable. Used only to flavor the
 * "System Ready" indicator in the top bar — not required for the UI to work.
 */
export function useBackendHealth() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    checkBackendHealth()
      .then(() => !cancelled && setStatus("online"))
      .catch(() => !cancelled && setStatus("offline"));
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
