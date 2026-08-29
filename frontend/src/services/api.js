const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Pings the backend health-check endpoint.
 * This is the only network call Phase 1 makes — everything else on the
 * page is static demo data.
 */
export async function checkBackendHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}
