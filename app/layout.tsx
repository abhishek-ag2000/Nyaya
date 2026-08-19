import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import NyayaAI from "@/components/NyayaAI";
import SiteExperience from "@/components/SiteExperience";
import { siteDescription, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";
import "./premium-theme.css";

const fraunces = Fraunces({ subsets: ["latin"], weight: "600", variable: "--font-fraunces" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-sans" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });
export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Nyaya civic-tech prototype" }],
  creator: "Nyaya civic-tech prototype",
  generator: "Next.js",
  keywords: ["digital courts India", "eCourts", "case status", "court services", "legal information", "cause list", "judgments", "lawyer directory", "judges directory", "civic technology"],
  category: "Civic technology",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: false, address: false, email: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", siteName, title: siteName, description: siteDescription, locale: "en_IN", images: siteUrl ? [{ url: `${siteUrl}/hero-justice.jpg`, width: 1600, height: 1067, alt: "Lady Justice representing accessible digital court services" }] : undefined },
  twitter: { card: "summary_large_image", title: siteName, description: siteDescription, images: siteUrl ? [`${siteUrl}/hero-justice.jpg`] : undefined }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { const websiteSchema = { "@context":"https://schema.org", "@type":"WebSite", name:siteName, description:siteDescription, url:siteUrl, inLanguage:"en-IN", potentialAction:{ "@type":"SearchAction", target:siteUrl ? `${siteUrl}/find-case?q={search_term_string}` : "/find-case?q={search_term_string}", "query-input":"required name=search_term_string" } }; return <html lang="en-IN"><body className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} /><SiteExperience />{children}<NyayaAI /></body></html>; }
