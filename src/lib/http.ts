/**
 * Patches the global `fetch` once at app startup so every API call —
 * without needing a wrapper threaded through each service file — always
 * sends cookies and reacts to an expired session. On a 401 we broadcast
 * a global event so `AuthProvider` can clear the stale user and redirect
 * to login instead of leaving the UI stuck in a fake "authenticated" state.
 */

export const AUTH_EXPIRED_EVENT = "auth:session-expired";

const UNAUTHORIZED = 401;

// A 401 here means "wrong credentials", not "session expired" — don't
// treat it as a reason to blow away the (nonexistent) session.
const LOGIN_ENDPOINT = "/auth/login";

const { fetch: originalFetch } = window;

window.fetch = async (...args: Parameters<typeof fetch>) => {
  const [resource, options = {}] = args;

  const response = await originalFetch(resource, {
    credentials: "include",
    ...options,
  });

  const url = resource instanceof Request ? resource.url : String(resource);

  if (response.status === UNAUTHORIZED && !url.includes(LOGIN_ENDPOINT)) {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }

  return response;
};
