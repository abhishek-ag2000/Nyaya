"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { getMockRole } from "@/data/mock-session";
import { roleConfig, type Role } from "@/data/roles";

const browseLinks = [
  { href: "/find-case", label: "Find a case" },
  { href: "/hearings", label: "Hearings" },
  { href: "/advocate-directory", label: "Lawyers Directory" },
  { href: "/judges-directory", label: "Judges Directory" },
  { href: "/nyaya-guide", label: "Nyaya Guide" },
  { href: "/about", label: "About" },
] as const;

const directoryItems = [
  { href: "/advocate-directory", label: "Lawyers Directory" },
  { href: "/judges-directory", label: "Judges Directory" },
] as const;

const DESKTOP_NAV = "(min-width: 1080px)";

export function isNavActive(pathname: string, href: string) {
  const path = href.split("?")[0] ?? href;
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const active = isNavActive(pathname, href);
  return (
    <Link href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined} onClick={onClick}>
      {label}
    </Link>
  );
}

function Disclosure({
  label,
  items,
  open,
  onOpen,
  onClose,
  className,
  active,
}: {
  label: string;
  items: readonly { href: string; label: string }[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  className?: string;
  active?: boolean;
}) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoverable, setHoverable] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHoverable(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) onClose();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={["nav-disclosure", className].filter(Boolean).join(" ")}
      ref={wrapRef}
      data-open={open || undefined}
      onMouseEnter={() => { if (hoverable) onOpen(); }}
      onMouseLeave={() => { if (hoverable) onClose(); }}
    >
      <button
        type="button"
        className={active ? "nav-disclosure-trigger is-active" : "nav-disclosure-trigger"}
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="true"
        onClick={() => (open ? onClose() : onOpen())}
      >
        {label}
        <ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div className="nav-disclosure-panel" id={id}>
          {items.map((item) => (
            <NavLink href={item.href} label={item.label} key={`${item.href}-${item.label}`} onClick={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PrimaryNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);
  const [openMenu, setOpenMenu] = useState<"directories" | "workspace" | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const refresh = () => setRole(getMockRole());
    refresh();
    window.addEventListener("nyaya-mock-session", refresh);
    return () => window.removeEventListener("nyaya-mock-session", refresh);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_NAV);
    const onChange = () => { if (media.matches) setDrawerOpen(false); };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (drawerOpen && !dialog.open) dialog.showModal();
    if (!drawerOpen && dialog.open) dialog.close();
  }, [drawerOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const closeDirectories = useCallback(() => setOpenMenu((current) => (current === "directories" ? null : current)), []);
  const closeWorkspace = useCallback(() => setOpenMenu((current) => (current === "workspace" ? null : current)), []);

  const publicDirectoryHrefs = new Set<string>(directoryItems.map((item) => item.href));
  const config = role ? roleConfig[role] : null;
  const workspaceItems = config
    ? [{ href: config.home, label: config.workspace }, ...config.navigation.slice(1).filter((item) => !publicDirectoryHrefs.has(item.href.split("?")[0] ?? item.href)).slice(0, 4)]
    : [];
  const directoryActive = directoryItems.some((item) => isNavActive(pathname, item.href));
  const browseHrefs = new Set<string>(browseLinks.map((item) => item.href));
  const workspaceActive = workspaceItems.some((item) => {
    const path = item.href.split("?")[0] ?? item.href;
    return !browseHrefs.has(path) && isNavActive(pathname, item.href);
  });

  return (
    <>
      <nav className="public-nav" aria-label="Primary">
        <NavLink href="/find-case" label="Find a case" />
        <NavLink href="/hearings" label="Hearings" />
        <Disclosure
          label="Directories"
          items={directoryItems}
          open={openMenu === "directories"}
          onOpen={() => setOpenMenu("directories")}
          onClose={closeDirectories}
          active={directoryActive}
        />
        <NavLink href="/nyaya-guide" label="Nyaya Guide" />
        <NavLink href="/about" label="About" />
      </nav>
      <div className="header-actions">
        {children}
        {config && (
          <Disclosure
            className="nav-workspace"
            label="Workspace"
            items={workspaceItems}
            open={openMenu === "workspace"}
            onOpen={() => setOpenMenu("workspace")}
            onClose={closeWorkspace}
            active={workspaceActive}
          />
        )}
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={drawerOpen}
          aria-controls="site-nav-drawer"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          onClick={() => {
            setOpenMenu(null);
            setDrawerOpen((open) => !open);
          }}
        >
          {drawerOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <dialog
        ref={dialogRef}
        id="site-nav-drawer"
        className="nav-drawer"
        aria-labelledby="site-nav-drawer-title"
        onClose={closeDrawer}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDrawer();
        }}
      >
        <div className="nav-drawer-panel">
          <header>
            <h2 id="site-nav-drawer-title">Menu</h2>
            <button type="button" className="nav-drawer-close" aria-label="Close menu" onClick={closeDrawer}>
              <X aria-hidden="true" />
            </button>
          </header>
          <nav aria-label="Browse">
            <p>Browse</p>
            {browseLinks.map((item) => (
              <NavLink href={item.href} label={item.label} key={item.href} onClick={closeDrawer} />
            ))}
          </nav>
          {config && (
            <>
              <nav aria-label="Workspace">
                <p>Workspace</p>
                {workspaceItems.map((item) => (
                  <NavLink href={item.href} label={item.label} key={`${item.href}-${item.label}`} onClick={closeDrawer} />
                ))}
              </nav>
              <nav aria-label="Account">
                <p>Account</p>
                <NavLink href="/profile" label="Profile" onClick={closeDrawer} />
              </nav>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
