/**
 * Parses a comma-separated email string from an env var into an array.
 * e.g. "a@x.com,b@x.com" → ["a@x.com", "b@x.com"]
 */
function parseAdminEmails(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Server-side admin check.
 * Uses ADMIN_EMAIL — never exposed to the browser.
 * Supports a comma-separated list of admin emails.
 * Call this inside Server Components, layouts, and server actions.
 */
export function isAdminEmailServer(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = parseAdminEmails(process.env.ADMIN_EMAIL);
  return admins.includes(email.toLowerCase());
}
