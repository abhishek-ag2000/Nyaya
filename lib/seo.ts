import type { Metadata } from "next";

export const siteName = "Nyaya Digital Courts";
export const siteDescription = "An independent civic-tech project exploring a clearer, unified digital court experience for citizens, advocates, judges, and court staff in India.";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export function createPageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = siteUrl ? `${siteUrl}${path}` : undefined;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: canonical,
      images: siteUrl ? [{ url: `${siteUrl}/hero-justice.jpg`, width: 1600, height: 1067, alt: "Lady Justice representing accessible digital court services" }] : undefined
    },
    twitter: { card: "summary_large_image", title, description, images: siteUrl ? [`${siteUrl}/hero-justice.jpg`] : undefined }
  };
}
