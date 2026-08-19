# Nyaya — Unified Digital Courts Interface

Nyaya is an independent civic-tech prototype exploring how India’s fragmented digital court journeys could feel clearer, more accessible, and more coherent.

It brings case discovery, timelines, filings, documents, hearings, notifications, court information, and role-aware workspaces into one responsive interface. The project uses a premium civic-tech visual system with accessible motion, layered data surfaces, and mobile-first layouts.

> [!IMPORTANT]
> Nyaya is a conceptual prototype. It is not affiliated with or endorsed by the Government of India, the e-Committee of the Supreme Court of India, NIC, or any court. It does not connect to live court systems. All cases, people, records, statistics, documents, and activity shown are synthetic or illustrative.

## Highlights

- Unified synthetic case workspace with status, procedural timeline, filings, documents, hearings, and action items
- Role-aware experiences for citizens, advocates, judges, registry staff, stenographers, and police personnel
- Case search by case details, party, advocate, judge, and location-based criteria
- Demonstration filing, document-intake, scrutiny, certified-copy, cause-list, and notification workflows
- Interactive India court-data visualization using synthetic statistics
- NyayaAI navigation assistant with clear prototype and legal-advice limitations
- Premium light civic-tech design system with glass surfaces, data grids, responsive layouts, and purposeful motion
- Keyboard focus styling and `prefers-reduced-motion` support
- Local browser persistence for synthetic demo sessions and case mutations

## Technology

- [Next.js 14](https://nextjs.org/) App Router
- [React 18](https://react.dev/) and TypeScript
- [Framer Motion](https://www.framer.com/motion/) for accessible interface motion
- [Tailwind CSS](https://tailwindcss.com/) and layered global CSS
- [Lucide React](https://lucide.dev/) icons
- `@svg-maps/india` for the India visualization
- pnpm package management

## Run locally

### Requirements

- Node.js 20 or newer
- Corepack or pnpm 11

```bash
git clone https://github.com/abhishek-ag2000/Nyaya.git
cd Nyaya
corepack enable
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The primary synthetic case ID is:

```text
NYA-WB-DEMO-04821
```

Use the mock login page to switch between the bundled role experiences. No credentials, identity numbers, or personal data are required.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Run every validation step together with:

```bash
pnpm check
```

## Project structure

```text
app/                  Next.js routes and global visual system
components/           Shared navigation, dashboards, case views, and workflows
components/cases/     Unified case, document, and filing interfaces
components/workspaces Role-specific workspace surfaces
data/                 Synthetic fixtures, role configuration, and local demo store
docs/                 Demonstration QA notes
public/demo/          Synthetic demonstration documents
scripts/              Supporting asset-generation scripts
```

The futuristic design layer is defined in `app/premium-theme.css`, while `components/SiteExperience.tsx` provides lightweight reveal and scroll-progress behavior.

## Prototype boundaries

Nyaya currently does **not** provide:

- Real authentication or institutional authorization
- Live case, court, cause-list, advocate, or judicial data
- Actual e-filing, document submission, payment, or certified-copy requests
- Identity, credential, or professional-status verification
- Legal advice or automated judicial decision-making
- A production backend or secure document store

Browser storage is used only to make the local synthetic demonstration interactive. Do not enter real case information or personal data.

## Design principles

1. Start with the person’s task, not the underlying government portal.
2. Explain procedural status in plain language without predicting outcomes.
3. Keep human responsibility visible in legal and institutional workflows.
4. Design for keyboard, mobile, reduced-motion, and low-context use.
5. Label synthetic and unavailable functionality honestly.

## License and use

No open-source license has been declared yet. Until a license is added, the repository remains all rights reserved by its owner. Public court-system references and third-party packages retain their respective ownership and licenses.
