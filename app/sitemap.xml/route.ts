const routes = ["/", "/about", "/find-case", "/courts", "/judgments", "/advocate-directory", "/judges-directory", "/nyaya-guide", "/nyaya-guide/what-happens-after-filing", "/nyaya-guide/what-is-a-cause-list", "/nyaya-guide/what-happens-during-a-hearing", "/nyaya-guide/what-is-an-interim-application", "/nyaya-guide/how-certified-copies-work", "/nyaya-guide/what-happens-after-a-judgment", "/cause-list", "/visit-court", "/get-help", "/privacy", "/terms", "/copyright", "/sitemap"];

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const updated = new Date().toISOString();
  const urls = routes.map((route) => `<url><loc>${origin}${route}</loc><lastmod>${updated}</lastmod><changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq><priority>${route === "/" ? "1.0" : "0.7"}</priority></url>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
