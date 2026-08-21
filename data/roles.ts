import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, FileText, Gavel, Landmark, Mic2, ShieldCheck } from "lucide-react";

export type Role = "citizen" | "advocate" | "judge" | "registry" | "stenographer" | "police";
export type CaseTab = "Overview" | "Timeline" | "Filings" | "Documents" | "Hearings" | "Readiness" | "Proceedings";
export type RoleNavItem = { label: string; href: string };
export type RoleConfig = { label: string; workspace: string; home: string; icon: LucideIcon; tabs: CaseTab[]; navigation: RoleNavItem[]; actions: RoleNavItem[]; priority: string[]; courtName?: string };

const DEMO_DOCUMENTS = "/cases/NYA-WB-DEMO-04821?tab=Filed+documents";
function sidebarNav(workspace: string, home: string): RoleNavItem[] {
  return [
    { label: workspace, href: home },
    { label: "Today’s Matters", href: "/today" },
    { label: "Hearings", href: "/hearings" },
    { label: "Pending Actions", href: "/pending-actions" },
    { label: "My Cases", href: "/my-cases" },
  ];
}

export const roleConfig: Record<Role, RoleConfig> = {
  citizen: { label: "Citizen / Litigant", workspace: "My Nyaya", home: "/citizen", icon: Landmark, tabs: ["Overview", "Timeline", "Documents", "Hearings"], navigation: sidebarNav("My Nyaya", "/citizen"), actions: [{ label: "Today’s matters", href: "/today" }, { label: "Get legal help", href: "/get-help" }], priority: ["My cases", "Next hearing"] },
  advocate: { label: "Advocate", workspace: "My Practice", home: "/advocate", icon: BriefcaseBusiness, tabs: ["Overview", "Timeline", "Filings", "Documents", "Hearings", "Readiness"], navigation: sidebarNav("My Practice", "/advocate"), actions: [{ label: "Start filing", href: "/file-a-case" }, { label: "Upload document", href: "/cases/NYA-WB-DEMO-04821/documents/upload" }, { label: "Today’s matters", href: "/today" }], priority: ["Attention", "Today’s matters", "Upcoming", "My cases"] },
  judge: { label: "Judge", workspace: "My Court", home: "/judge", icon: Gavel, tabs: ["Overview", "Timeline", "Filings", "Documents", "Hearings", "Readiness"], courtName: "District & Sessions Court, Darjeeling", navigation: sidebarNav("My Court", "/judge"), actions: [{ label: "Open today’s docket", href: "/today" }, { label: "Review case readiness", href: "/cases/NYA-WB-DEMO-04821" }, { label: "Open court information", href: "/courts" }], priority: ["Today’s docket", "Readiness", "Pending applications", "Long-pending matters"] },
  registry: { label: "Court Staff / Registry", workspace: "Registry Workspace", home: "/registry", icon: FileText, tabs: ["Overview", "Filings", "Documents", "Readiness"], navigation: sidebarNav("Registry Workspace", "/registry"), actions: [{ label: "Review new filing", href: "/cases/NYA-WB-DEMO-04821?tab=Filed+documents" }, { label: "Open scrutiny queue", href: "/filing-defects" }, { label: "Review copy requests", href: "/certified-copy" }], priority: ["Work queue", "Filings", "Defects", "Resubmissions", "Copy requests"] },
  stenographer: { label: "Stenographer", workspace: "Proceedings Workspace", home: "/stenographer", icon: Mic2, tabs: ["Overview", "Proceedings", "Documents", "Hearings"], navigation: sidebarNav("Proceedings Workspace", "/stenographer"), actions: [{ label: "Open proceedings", href: "/today" }, { label: "Review draft", href: "/cases/NYA-WB-DEMO-04821" }, { label: "View documents", href: DEMO_DOCUMENTS }], priority: ["Today’s proceedings", "Drafts", "Needs review", "Recently completed"] },
  police: { label: "Police / Investigating Officer", workspace: "Investigation Workspace", home: "/police", icon: ShieldCheck, tabs: ["Overview", "Timeline", "Documents", "Hearings"], navigation: sidebarNav("Investigation Workspace", "/police"), actions: [{ label: "Review court dates", href: "/today" }, { label: "Open linked matter", href: "/cases/NYA-WB-DEMO-04821" }, { label: "View authorized documents", href: DEMO_DOCUMENTS }], priority: ["Attention", "Linked matters", "Court dates", "Chargesheets", "Service status"] }
};

const legacyRoles: Record<string, Role> = { "Citizen / Litigant": "citizen", Advocate: "advocate", Judge: "judge", "Court Staff / Registry": "registry", Stenography: "stenographer", Stenographer: "stenographer", "Police / Investigating Officer": "police", "Government Pleader": "advocate", "Court Clerk": "registry" };
const workspacePrefixes = ["/citizen", "/advocate", "/judge", "/registry", "/stenographer", "/police", "/today", "/hearings", "/pending-actions", "/my-cases", "/filing-defects", "/file-a-case", "/cases", "/notifications", "/profile", "/certified-copy"] as const;
export function parseRole(value: string | null): Role | null { if (!value) return null; return (Object.keys(roleConfig) as Role[]).includes(value as Role) ? value as Role : legacyRoles[value] ?? null; }
export function roleHome(role: Role) { return roleConfig[role].home; }
export function isWorkspacePath(pathname: string) {
  return workspacePrefixes.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
