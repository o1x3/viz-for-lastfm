/**
 * Canonical site URL for metadata and absolute links.
 * On Vercel, VERCEL_* is set automatically; set NEXT_PUBLIC_SITE_URL
 * when using a custom domain so OG/social cards use the right origin.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  const preview = process.env.VERCEL_URL;
  if (preview) return `https://${preview}`;

  return "http://localhost:3000";
}
