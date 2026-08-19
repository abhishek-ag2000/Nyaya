"use client";

import { useEffect } from "react";

export default function SiteExperience() {
  useEffect(() => {
    const root = document.documentElement;
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll-progress", `${max > 0 ? (window.scrollY / max) * 100 : 0}%`);
    };
    const targets = document.querySelectorAll<HTMLElement>("main section, main article, .case-panel, .workspace-section, .dashboard-section");
    targets.forEach((target) => target.classList.add("reveal-ready"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-revealed"); observer.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -8%", threshold: 0.08 });
    targets.forEach((target) => observer.observe(target));
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => { observer.disconnect(); window.removeEventListener("scroll", updateProgress); window.removeEventListener("resize", updateProgress); };
  }, []);
  return <div className="site-progress" aria-hidden="true"><i /></div>;
}
