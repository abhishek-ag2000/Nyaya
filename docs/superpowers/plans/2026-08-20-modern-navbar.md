# Modern Single-Bar Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Nyaya’s stacked two-layer header with one sticky modern bar: desktop dropdowns for Directories and Workspace, and a right-side drawer under 900px.

**Architecture:** Keep `Header` in `components/SiteChrome.tsx` for wordmark + action cluster. Rebuild `components/PrimaryNav.tsx` to own public links, Directories/Workspace disclosures, the menu button, and a native `<dialog>` drawer. Place the workspace disclosure and menu button in the right cluster by rendering `PrimaryNav` as a `display: contents` wrapper so its children participate in `.header-inner` flex layout.

**Tech Stack:** Next.js 15 App Router, React 19 client components, `next/link` + `usePathname`, lucide-react, existing CSS in `app/globals.css` and `app/premium-theme.css`. No new dependencies. No unit-test runner exists; verify with `pnpm typecheck` and `pnpm lint`.

## Global Constraints

- Breakpoint: inline nav at `min-width: 900px`; drawer below `900px`.
- Workspace links: `roleConfig[role].home` plus `roleConfig[role].navigation.slice(1, 5)`.
- Public links: Find a case `/find-case`, Directories dropdown (Lawyers `/advocate-directory`, Judges `/judges-directory`), Nyaya Guide `/nyaya-guide`, About `/about`.
- Do not rewrite `AuthControls` or `NotificationBell` logic.
- No mega-menu, no in-header search, no new routes.
- Keep premium civic-tech tokens (paper, brass, ink). Sticky header at all breakpoints.
- Menu button, drawer links, and dropdown items: min 44px hit target.
- Drawer: native `<dialog>` via `showModal()`, width `min(100vw - 48px, 360px)`, labelled groups Browse / Workspace / Profile.
- `prefers-reduced-motion: reduce` disables drawer slide.

---

### Task 1: Rebuild PrimaryNav

**Files:**
- Modify: `components/PrimaryNav.tsx`
- Modify: `components/SiteChrome.tsx`

**Interfaces:**
- Consumes: `getMockRole()`, `roleConfig`, `Role` from existing modules
- Produces: `PrimaryNav` default export that renders public `<nav aria-label="Primary">`, optional workspace disclosure, menu button (`aria-controls="site-nav-drawer"`), and `<dialog id="site-nav-drawer">`

- [ ] **Step 1: Replace `components/PrimaryNav.tsx` with the single-bar implementation**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { getMockRole } from "@/data/mock-session";
import { roleConfig, type Role } from "@/data/roles";

const browseLinks = [
  { href: "/find-case", label: "Find a case" },
  { href: "/advocate-directory", label: "Lawyers Directory" },
  { href: "/judges-directory", label: "Judges Directory" },
  { href: "/nyaya-guide", label: "Nyaya Guide" },
  { href: "/about", label: "About" },
] as const;

function pathOf(href: string) {
  return href.split("?")[0] ?? href;
}

export function isNavActive(pathname: string, href: string) {
  const path = pathOf(href);
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
  onToggle,
  onClose,
}: {
  label: string;
  items: readonly { href: string; label: string }[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

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
    <div className="nav-disclosure" ref={wrapRef} onMouseEnter={onToggle.bind(null)} data-open={open || undefined}>
      <button type="button" className="nav-disclosure-trigger" aria-expanded={open} aria-controls={id} aria-haspopup="menu" onClick={onToggle}>
        {label}
        <ChevronDown aria-hidden="true" />
      </button>
      <div className="nav-disclosure-panel" id={id} hidden={!open} role="menu">
        {items.map((item) => (
          <NavLink href={item.href} label={item.label} key={item.href} onClick={onClose} />
        ))}
      </div>
    </div>
  );
}

export default function PrimaryNav() {
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
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (drawerOpen && !dialog.open) dialog.showModal();
    if (!drawerOpen && dialog.open) dialog.close();
  }, [drawerOpen]);

  const config = role ? roleConfig[role] : null;
  const workspaceItems = config
    ? [{ href: config.home, label: config.workspace }, ...config.navigation.slice(1, 5)]
    : [];
  const directoryItems = [
    { href: "/advocate-directory", label: "Lawyers Directory" },
    { href: "/judges-directory", label: "Judges Directory" },
  ];

  function closeDrawer() {
    setDrawerOpen(false);
  }

  return (
    <div className="primary-nav-root">
      <nav className="public-nav" aria-label="Primary">
        <NavLink href="/find-case" label="Find a case" />
        <Disclosure
          label="Directories"
          items={directoryItems}
          open={openMenu === "directories"}
          onToggle={() => setOpenMenu((current) => (current === "directories" ? null : "directories"))}
          onClose={() => setOpenMenu((current) => (current === "directories" ? null : current))}
        />
        <NavLink href="/nyaya-guide" label="Nyaya Guide" />
        <NavLink href="/about" label="About" />
      </nav>
      {config && (
        <Disclosure
          label="Workspace"
          items={workspaceItems}
          open={openMenu === "workspace"}
          onToggle={() => setOpenMenu((current) => (current === "workspace" ? null : "workspace"))}
          onClose={() => setOpenMenu((current) => (current === "workspace" ? null : current))}
        />
      )}
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={drawerOpen}
        aria-controls="site-nav-drawer"
        aria-label={drawerOpen ? "Close menu" : "Open menu"}
        onClick={() => setDrawerOpen((open) => !open)}
      >
        {drawerOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
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
            <nav aria-label="Workspace">
              <p>Workspace</p>
              {workspaceItems.map((item) => (
                <NavLink href={item.href} label={item.label} key={`${item.href}-${item.label}`} onClick={closeDrawer} />
              ))}
              <NavLink href="/profile" label="Profile" onClick={closeDrawer} />
            </nav>
          )}
        </div>
      </dialog>
    </div>
  );
}
```

Fix hover: do not use `onMouseEnter={onToggle.bind(null)}` (that toggles closed on enter). Use `onMouseEnter` to open and `onMouseLeave` to close, gated by `(hover: hover) and (pointer: fine)` inside the effect or a media query in the component.

Correct disclosure hover:

```tsx
useEffect(() => {
  const media = window.matchMedia("(hover: hover) and (pointer: fine)");
  setHoverable(media.matches);
  const onChange = () => setHoverable(media.matches);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}, []);
```

Then `onMouseEnter={() => { if (hoverable) onOpen(); }}` and `onMouseLeave={() => { if (hoverable) onClose(); }}`. Pass distinct `onOpen` / `onClose` instead of a single toggle for hover.

- [ ] **Step 2: Update `components/SiteChrome.tsx` Header**

Remove `UserRound` import and the profile `Link`. Keep wordmark, `PrimaryNav`, status chip, `NotificationBell`, `AuthControls`.

```tsx
export function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Wordmark />
        <PrimaryNav />
        <div className="header-actions">
          <span className="system-status"><i /> {currentDateLabel()}</span>
          <NotificationBell />
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
```

Because `.primary-nav-root` uses `display: contents`, CSS order places: wordmark, public nav, header-actions, workspace disclosure, menu button.

- [ ] **Step 3: Verify types**

Run: `corepack pnpm typecheck`  
Expected: PASS (no errors in PrimaryNav / SiteChrome)

---

### Task 2: Header CSS — single bar, dropdowns, drawer

**Files:**
- Modify: `app/globals.css` (remove two-layer `nav-stack` / `.header-inner:has(.workspace-nav)` / mobile `.nav-stack` width rules)
- Modify: `app/premium-theme.css` (header layout, disclosures, drawer, breakpoints)

**Interfaces:**
- Consumes: class names from Task 1 (`primary-nav-root`, `public-nav`, `nav-disclosure`, `nav-toggle`, `nav-drawer`)
- Produces: one-row sticky header at all widths

- [ ] **Step 1: Neutralize two-layer rules in `app/globals.css`**

Delete or empty:

- `.header-inner:has(.workspace-nav) { min-height:108px; }.nav-stack { flex:1; }.workspace-nav { ... }`
- `.nav-stack { align-items:center; display:flex; flex-direction:column; ... }` and the `@media(max-width:760px){.nav-stack{width:100%;min-width:0}}` rule

Leave generic `nav { display:flex; ... }` if other pages use raw `nav`; override `.public-nav` in premium-theme.

- [ ] **Step 2: Replace civic chrome header block and mobile header overrides in `app/premium-theme.css`**

Desktop (≥900px):

```css
.header-inner {
  align-items: center;
  display: flex;
  gap: 16px;
  min-height: 64px;
}
.primary-nav-root { display: contents; }
.public-nav {
  align-items: center;
  display: flex;
  flex: 1;
  gap: 4px;
  justify-content: center;
  min-width: 0;
}
.public-nav a,
.nav-disclosure-trigger {
  border-radius: 999px;
  color: var(--ink-soft);
  font-size: 14px;
  font-weight: 500;
  min-height: 44px;
  padding: 8px 12px;
}
.public-nav a.is-active,
.nav-drawer a.is-active {
  background: rgba(184,155,94,.16);
  color: var(--brass-deep);
}
.nav-disclosure { position: relative; }
.nav-disclosure-panel {
  background: #fff;
  border: 1px solid rgba(184,155,94,.4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  min-width: 220px;
  padding: 8px;
  position: absolute;
  top: calc(100% + 6px);
  z-index: 60;
}
.nav-toggle { display: none; }
.primary-nav-root > .nav-disclosure { order: 4; } /* after .header-actions */
```

`.header-inner` children need order:

```css
.header-inner > .wordmark { order: 1; }
.public-nav { order: 2; }
.header-actions { order: 3; }
.primary-nav-root > .nav-disclosure { order: 4; }
.nav-toggle { order: 5; }
```

Drawer:

```css
.nav-drawer {
  border: 0;
  height: 100%;
  margin: 0 0 0 auto;
  max-height: 100%;
  padding: 0;
  width: min(calc(100vw - 48px), 360px);
}
.nav-drawer::backdrop { background: rgba(26,25,23,.46); }
.nav-drawer-panel { display: flex; flex-direction: column; gap: 18px; min-height: 100%; padding: 18px; }
.nav-drawer nav { display: flex; flex-direction: column; gap: 4px; }
.nav-drawer nav p {
  color: var(--muted);
  font: 500 10px var(--font-plex-mono), monospace;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.nav-drawer a { min-height: 44px; padding: 10px 12px; border-radius: 12px; }
```

`@media (max-width: 899px)`:

- `.public-nav, .primary-nav-root > .nav-disclosure { display: none; }`
- `.nav-toggle { display: inline-flex; min-height: 44px; min-width: 44px; }`
- `.site-header { position: sticky; }` — do **not** set `position: relative`
- Remove `.nav-stack` wrap / overflow-x scroll overrides
- Keep `.system-status { display: none; }` at 900px (already present)
- Keep `.profile-link` unused; can leave hide rule or delete

`@media (prefers-reduced-motion: reduce)`:

```css
.nav-drawer { transition: none; }
```

Animate drawer with `dialog[open] { animation: navDrawerIn 200ms var(--ease); }` and skip animation under reduced motion.

- [ ] **Step 3: Remove the 760px block that sets `.site-header { position:relative; }` and the two-row nav scroll rules** (premium-theme lines 165–173). Replace with the 899px drawer rules above. Keep unrelated mobile rules (hero, tabs, etc.).

- [ ] **Step 4: Verify**

Run: `corepack pnpm typecheck` and `corepack pnpm lint`  
Expected: PASS

Manual: 1440 / 1024 / 900 / 760 / 390 — one row, no double scroll; desktop Directories + Workspace dropdowns; mobile drawer with Browse / Workspace / Profile; Escape and backdrop close drawer; sticky header remains.

---

## Spec coverage

| Spec item | Task |
| --- | --- |
| Single sticky bar ≥900px | 2 |
| Directories + Workspace dropdowns | 1 |
| Right drawer <900px with Browse / Workspace / Profile | 1+2 |
| Remove profile icon | 1 (SiteChrome) |
| AuthControls / NotificationBell unchanged | 1 |
| Sticky restored, no double scroll | 2 |
| Active route, 44px targets, dialog, reduced motion | 1+2 |
| No mega-menu / search / new routes | all |

## Self-review notes

- Hover must call `onOpen`, not `onToggle`.
- Workspace disclosure is a sibling of `.header-actions` via `display: contents` so it sits beside the account menu.
- Profile appears in the drawer when signed in; desktop Profile stays in `AuthControls`.
- No test runner in package.json; do not add Vitest in this plan.
