import { BriefcaseBusiness, ClipboardList, Gavel, Keyboard, Shield, User } from "lucide-react";

const previews = [
  ["Citizen / Litigant", "MY CASES", "2 Active", "Next hearing · 03 Sep", "Understand your case without needing to understand the system first."],
  ["Advocate", "TODAY", "3 Hearings", "2 deadlines · 1 new document", "See cases, deadlines and court activity in one workspace."],
  ["Judge", "TODAY’S DOCKET", "18 Cases", "3 missing documents", "Surface administrative information and case readiness. Decisions remain with the court."],
  ["Court Staff", "REGISTRY QUEUE", "12 New filings", "4 require review", "Bring structure to filing and verification workflows."],
  ["Police / IO", "CASE LINKAGE", "FIR → Chargesheet", "Court case · synthetic demo", "Track authorized case-related workflow and document status."],
  ["Stenography", "DRAFT RECORD", "Human review", "Transcription draft only", "Technology can assist drafting; humans review and finalize."]
].map(([title, , , , description], index) => [title, description, [User, BriefcaseBusiness, Gavel, ClipboardList, Shield, Keyboard][index]] as const);
export default function RoleExperience() { return <section className="role-experience" aria-labelledby="roles-heading"><div className="wrap"><div className="center-heading"><p className="kicker">Designed for everyone in the justice journey</p><h2 id="roles-heading">One shared foundation.<br />A view for every role.</h2></div><div className="experience-grid">{previews.map(([title, description, Icon]) => <article className="experience-card" key={title}><span className="role-icon"><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>; }
