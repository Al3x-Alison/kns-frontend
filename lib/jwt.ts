/**
 * Best-effort JWT payload decode, used only to figure out which row in the
 * admin users table is "me" (so the UI can disable self-delete before the
 * backend's own check kicks in). Not used for any security decision.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getSelfIdentifiers(token: string | null): { id?: string; email?: string } {
  if (!token) return {};
  const payload = decodeJwtPayload(token);
  if (!payload) return {};
  const id = [payload.sub, payload.user_id, payload.id]
    .find((v): v is string => typeof v === "string");
  const email = [payload.email, payload.sub]
    .find((v): v is string => typeof v === "string" && v.includes("@"));
  return { id, email };
}
