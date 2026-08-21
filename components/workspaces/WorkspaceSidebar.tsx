"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isNavActive } from "@/components/PrimaryNav";
import { getMockRole } from "@/data/mock-session";
import { isWorkspacePath, roleConfig, type Role } from "@/data/roles";

function isWorkspaceTabActive(pathname: string, search: string, href: string) {
  const [path, query] = href.split("?");
  const wantedTab = new URLSearchParams(query ?? "").get("tab");
  if (wantedTab) {
    const currentTab = new URLSearchParams(search).get("tab");
    if (wantedTab.toLowerCase() === "documents" || wantedTab.toLowerCase() === "filed documents") {
      const tab = (currentTab ?? "").replace(/\+/g, " ").toLowerCase();
      return pathname.includes("/documents") || (pathname === path && ["documents", "filed documents", "filings"].includes(tab));
    }
    return pathname === path && currentTab?.toLowerCase() === wantedTab.toLowerCase();
  }
  return isNavActive(pathname, href);
}

export function WorkspaceSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const config = roleConfig[role];
  const Icon = config.icon;
  const search = searchParams.toString();
  return (
    <aside className="workspace-sidebar">
      <div className="workspace-role">
        <Icon aria-hidden="true" />
        <div className="workspace-role-copy">
          <span>{config.label}</span>
          <b>{config.workspace}</b>
          {config.courtName ? <em className="workspace-court-name">{config.courtName}</em> : null}
        </div>
      </div>
      <nav aria-label={`${config.workspace} tabs`} className="workspace-tabs">
        {config.navigation.map((item) => {
          const active = isWorkspaceTabActive(pathname, search, item.href);
          return (
            <Link href={item.href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined} key={item.label}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function WorkspaceRail() {
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);
  const active = Boolean(role && isWorkspacePath(pathname));

  useEffect(() => {
    const refresh = () => setRole(getMockRole());
    refresh();
    window.addEventListener("nyaya-mock-session", refresh);
    return () => window.removeEventListener("nyaya-mock-session", refresh);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-workspace-rail", active);
    if (!active) {
      document.documentElement.style.removeProperty("--workspace-rail-top");
      document.documentElement.style.removeProperty("--workspace-rail-bottom");
      document.documentElement.style.removeProperty("--workspace-rail-stack");
      document.documentElement.style.removeProperty("--workspace-page-inset");
      return;
    }
    const update = () => {
      const header = document.querySelector(".site-header");
      const headerInner = document.querySelector(".header-inner");
      const footer = document.querySelector("footer");
      const sidebar = document.querySelector(".workspace-sidebar");
      const headerBottom = header instanceof HTMLElement ? Math.max(0, Math.round(header.getBoundingClientRect().bottom)) : 74;
      const inset = headerInner instanceof HTMLElement ? Math.max(0, Math.round(headerInner.getBoundingClientRect().left)) : 24;
      const footerTop = footer instanceof HTMLElement ? footer.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
      const gutter = 24;
      const topGutter = window.innerWidth > 850 ? 12 : 0;
      const pinTop = headerBottom + topGutter;
      // Sticky-like: stay pinned while scrolling, then ride up with the footer.
      // Skip on short/loading pages (footer sits high) and on the mobile stacked rail.
      const pageIsTall = document.documentElement.scrollHeight > window.innerHeight + 80;
      const footerPush =
        window.innerWidth > 850 && pageIsTall
          ? Math.max(0, Math.round(window.innerHeight - footerTop + gutter))
          : 0;
      const top = pinTop - footerPush;
      const bottom = gutter + footerPush;
      document.documentElement.style.setProperty("--workspace-rail-top", `${top}px`);
      document.documentElement.style.setProperty("--workspace-rail-bottom", `${bottom}px`);
      document.documentElement.style.setProperty("--workspace-page-inset", `${inset}px`);
      if (window.innerWidth <= 850 && sidebar instanceof HTMLElement) {
        document.documentElement.style.setProperty("--workspace-rail-stack", `${sidebar.offsetHeight}px`);
      } else {
        document.documentElement.style.removeProperty("--workspace-rail-stack");
      }
    };
    update();
    // Remeasure after paint — post-login workspace content often expands after the first pass.
    let frame2 = 0;
    const frame1 = window.requestAnimationFrame(() => {
      update();
      frame2 = window.requestAnimationFrame(update);
    });
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    const watchLayoutTargets = () => {
      resizeObserver?.observe(document.body);
      const footer = document.querySelector("footer");
      const main = document.querySelector("main");
      if (footer instanceof HTMLElement) resizeObserver?.observe(footer);
      if (main instanceof HTMLElement) resizeObserver?.observe(main);
    };
    watchLayoutTargets();
    // RoleWorkspace swaps the loading <main> for the full page after session hydrate.
    const mutationObserver = typeof MutationObserver !== "undefined"
      ? new MutationObserver(() => {
          watchLayoutTargets();
          update();
        })
      : null;
    mutationObserver?.observe(document.body, { childList: true });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      document.body.classList.remove("has-workspace-rail");
      document.documentElement.style.removeProperty("--workspace-rail-top");
      document.documentElement.style.removeProperty("--workspace-rail-bottom");
      document.documentElement.style.removeProperty("--workspace-rail-stack");
      document.documentElement.style.removeProperty("--workspace-page-inset");
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active]);

  if (!role || !active) return null;
  return <WorkspaceSidebar role={role} />;
}
