"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { WorkspaceRail } from "@/components/workspaces/WorkspaceSidebar";

const REVEAL_SELECTOR = "main section, main article, .case-panel, .workspace-section, .dashboard-section";

export default function SiteExperience() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll-progress", `${max > 0 ? (window.scrollY / max) * 100 : 0}%`);
    };

    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    }), { rootMargin: "0px 0px -8%", threshold: 0.08 });

    const watch = (node: Element) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.classList.contains("is-revealed")) return;
      if (!node.classList.contains("reveal-ready")) node.classList.add("reveal-ready");
      // Tab switches mount panels after first paint; reveal immediately if already on screen
      // so signed-in workspace-rail layout shifts cannot leave them stuck at opacity 0.
      const rect = node.getBoundingClientRect();
      if (rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
        node.classList.add("is-revealed");
        return;
      }
      observer.observe(node);
    };

    const scan = () => document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(watch);
    scan();

    // Tab panels (Filed documents / Orders) mount after the first paint — watch for them.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(REVEAL_SELECTOR)) watch(node);
          node.querySelectorAll?.(REVEAL_SELECTOR).forEach(watch);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [pathname]);

  return <><div className="site-progress" aria-hidden="true"><i /></div><Suspense fallback={null}><WorkspaceRail /></Suspense></>;
}
