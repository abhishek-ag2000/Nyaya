import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import NyayaAI from "@/components/NyayaAI";
import SiteExperience from "@/components/SiteExperience";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], weight: "600", variable: "--font-fraunces" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-sans" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });
export const metadata: Metadata = { title: "Nyaya Unified Interface", description: "Independent civic-tech prototype with synthetic data." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}><SiteExperience />{children}<NyayaAI /></body></html>; }
