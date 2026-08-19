export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /cases/",
    "Disallow: /demo/",
    "Disallow: /profile/",
    "Disallow: /notifications/",
    "Disallow: /my-cases/",
    "Disallow: /my-nyaya/",
    "Disallow: /citizen/",
    "Disallow: /advocate/",
    "Disallow: /judge/",
    "Disallow: /registry/",
    "Disallow: /stenographer/",
    "Disallow: /police/",
    `Sitemap: ${origin}/sitemap.xml`
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
