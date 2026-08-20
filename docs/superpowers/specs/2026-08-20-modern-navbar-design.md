# Modern single-bar navbar redesign

Date: 2026-08-20  
Status: approved for planning after user spec review

## Problem

Nyaya’s site header stacks two nav layers: a public row (`Nyaya Guide`, `Find a case`, `Lawyers Directory`, `Judges Directory`, `About Us`) and, when signed in, a workspace row. On viewports ≤760px both become full-width horizontal scroll strips, sticky positioning is disabled, and the profile icon is hidden. That is not a standard modern website header and is poor on mobile.

## Goal

Replace the two-layer header with one compact, sticky bar on all breakpoints. Extra links live in dropdowns on desktop and in a right-side drawer on smaller screens.

## Non-goals

- Mega-menu or multi-column marketing nav
- In-header search
- New routes or new destination pages
- Rewriting `AuthControls` session switching or `NotificationBell` popover logic
- Changing footer navigation

## Layout

### Desktop (≥900px)

One sticky bar, about 64px tall:

| Region | Contents |
| --- | --- |
| Left | Nyaya wordmark (home) |
| Center | Primary links: Find a case · Directories (dropdown: Lawyers Directory, Judges Directory) · Nyaya Guide · About |
| Right | Date/status chip (desktop only) · notifications · account cluster |

Signed out: Sign up + Log in.  
Signed in: Workspace dropdown (workspace home + up to four additional role links from `roleConfig.navigation.slice(1, 5)`) beside the existing account menu.

No second bar. No standalone profile icon; Profile remains in the account menu.

### Tablet and mobile (<900px)

Same sticky bar:

- Wordmark
- Notifications
- Account cluster (Log in when signed out; account menu when signed in)
- Menu button

Sign up may hide on the narrowest widths (existing ≤420px rule) because it remains available via `/login` and the drawer does not need to duplicate auth CTAs.

Right-side drawer:

1. **Browse** — Find a case, Lawyers Directory, Judges Directory (un-nested), Nyaya Guide, About
2. **Workspace** — only when signed in; same links as the desktop Workspace dropdown
3. **Profile** — signed-in only, link to `/profile`

## Components

Keep `Header` in `components/SiteChrome.tsx`. Rebuild `components/PrimaryNav.tsx` to own:

- Desktop primary links and Directories dropdown
- Signed-in Workspace dropdown
- Mobile menu button, backdrop, and right drawer

Do not move notification or auth logic. Only restyle/place `NotificationBell` and `AuthControls` in the right cluster.

Remove the standalone profile `Link` from `Header`.

## Interaction rules

- Pointer devices: dropdowns open on hover or click; keyboard and touch use click/focus.
- Escape and outside click close the open dropdown. Only one dropdown is open at a time.
- Menu button uses `aria-expanded` and `aria-controls` pointing at the drawer.
- Drawer: labelled groups, focus trap while open, Escape and backdrop close it, choosing a link closes it.
- Restore `position: sticky` on `.site-header` at all breakpoints (remove the mobile `position: relative` override).
- Current route gets a visible active state on matching links (including drawer and dropdown items).
- Date/status chip remains hidden below 900px (existing behavior).

## Accessibility

- Header is a `<header>` with primary navigation in `<nav aria-label="Primary">`.
- Directories and Workspace are disclosure widgets (`button` + menu), not hover-only.
- Drawer is a modal dialog pattern (`role="dialog"` or native `<dialog>`, `aria-modal="true"`, labelled).
- Focus visible styles already exist globally; keep 44px minimum hit targets on menu button, drawer links, and dropdown items.
- Respect `prefers-reduced-motion`: drawer slides without large travel, or instant show/hide.

## Visual

Stay on the existing premium civic-tech tokens in `app/premium-theme.css` (paper, brass, ink, glass header). Do not introduce a new color system.

- Single row, no wrapped nav chips
- Dropdown panels: surface background, light brass border, existing radius/shadow
- Drawer: full viewport height, ~min(100vw - 48px, 360px) wide, slides from the right
- Wordmark “Digital Courts” subtitle may still hide on the smallest widths

## Files expected to change

- `components/PrimaryNav.tsx` — rebuild
- `components/SiteChrome.tsx` — header composition (drop profile icon; keep wordmark and actions)
- `app/globals.css` — remove two-layer nav-stack rules that conflict
- `app/premium-theme.css` — header, dropdown, drawer, breakpoint styles

## Success criteria

- One header row at 1440, 1280, 1024, 900, 760, 390, 375, and 360 px
- No horizontal double-scroll nav strips
- Signed-in workspace links reachable on desktop (dropdown) and mobile (drawer)
- Keyboard: tab through bar, open Directories/Workspace/drawer, Escape closes, focus returns to the control
- QA checklist section D (responsive and accessibility) still applies
