/**
 * Canonical site URL for metadata and absolute links.
 * On Vercel, VERCEL_* is set automatically; set NEXT_PUBLIC_SITE_URL
 * when using a custom domain so OG/social cards use the right origin.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return withProtocol(explicit);

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return withProtocol(production);

  const preview = process.env.VERCEL_URL;
  if (preview) return withProtocol(preview);

  return "http://localhost:3000";
}

function withProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}
