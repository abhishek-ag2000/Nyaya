import type { Role } from "@/data/roles";
import type { UnifiedCase } from "@/data/unified-case";

export type HearingStatus =
  | "UPCOMING"
  | "WAITING"
  | "LIVE"
  | "COMPLETED"
  | "ADJOURNED"
  | "CANCELLED";

export type HearingMode = "PHYSICAL" | "VIRTUAL" | "HYBRID";

export type HearingAccess =
  | "PUBLIC"
  | "CASE_PARTICIPANTS"
  | "ADVOCATES_ONLY"
  | "COURT_ONLY"
  | "RESTRICTED";

export type HearingVideoSource = {
  type: "DEMO_VIDEO" | "LIVE_STREAM" | "EXTERNAL_MEETING";
  url?: string;
  localAsset?: string;
};

export type HearingParticipantRole =
  | "JUDGE"
  | "PETITIONER_ADVOCATE"
  | "RESPONDENT_ADVOCATE"
  | "PETITIONER"
  | "RESPONDENT"
  | "COURT_STAFF"
  | "OTHER";

export type HearingParticipant = {
  id: string;
  name: string;
  role: HearingParticipantRole;
};

export type VirtualHearingProvider =
  | "NYAY"
  | "ZOOM"
  | "WEBEX"
  | "GOOGLE_MEET"
  | "JITSI"
  | "OTHER";

export type VirtualHearing = {
  provider: VirtualHearingProvider;
  joinUrl?: string;
  meetingId?: string;
  passcode?: string;
  availableFrom?: string;
  availableUntil?: string;
};

export type Hearing = {
  id: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  courtName: string;
  courtNumber?: string;
  judgeName?: string;
  itemNumber?: number;
  hearingDate: string;
  hearingTime?: string;
  purpose?: string;
  proceduralStage?: string;
  status: HearingStatus;
  mode: HearingMode;
  access: HearingAccess;
  isDemo: boolean;
  videoSource?: HearingVideoSource;
  virtualHearing?: VirtualHearing;
  participants?: HearingParticipant[];
  previousHearingDate?: string;
  nextHearingDate?: string;
};

const JUDGE_DEMO_COURT = "4";
const statusStorageKey = "nyaya-hearing-status-overrides";

const participant = (
  id: string,
  name: string,
  role: HearingParticipantRole
): HearingParticipant => ({ id, name, role });

/** Seed hearings for the demo day (Asia/Kolkata "today" for the prototype: 2026-08-20). */
const seedHearings: Hearing[] = [
  {
    id: "hearing-demo-001",
    caseId: "NYA-DEMO-CIV-02031",
    caseNumber: "CS 144/2025",
    caseTitle: "Mehta Properties v. Arun Das",
    courtName: "District Judge Court, Siliguri",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 18,
    hearingDate: "2026-08-20",
    hearingTime: "11:30 AM",
    purpose: "Final Arguments",
    proceduralStage: "Final Arguments",
    status: "LIVE",
    mode: "VIRTUAL",
    access: "PUBLIC",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-01.mp4" },
    virtualHearing: { provider: "NYAY" },
    previousHearingDate: "2026-08-12",
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Rahul Mehta", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. A. Sharma", "RESPONDENT_ADVOCATE"),
      participant("p4", "Mehta Properties Pvt. Ltd. (Demo)", "PETITIONER"),
      participant("p5", "Arun Das (Demo)", "RESPONDENT"),
    ],
  },
  {
    id: "hearing-demo-002",
    caseId: "NYA-DEMO-CRM-00109",
    caseNumber: "Sessions 109/2025",
    caseTitle: "State v. Demo Accused",
    courtName: "Sessions Court, Darjeeling",
    courtNumber: "3",
    judgeName: "Presiding Judge Demo-03",
    itemNumber: 14,
    hearingDate: "2026-08-20",
    hearingTime: "11:10 AM",
    purpose: "Arguments",
    proceduralStage: "Arguments",
    status: "LIVE",
    mode: "HYBRID",
    access: "RESTRICTED",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-02.mp4" },
    previousHearingDate: "2026-08-05",
    participants: [
      participant("p1", "Presiding Judge Demo-03", "JUDGE"),
      participant("p2", "Public Prosecutor", "RESPONDENT_ADVOCATE"),
      participant("p3", "Adv. Defence Counsel", "PETITIONER_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-003",
    caseId: "NYA-DEMO-EXE-00714",
    caseNumber: "EP 714/2024",
    caseTitle: "Demo Finance Ltd. v. R. Sen",
    courtName: "District Court, Kolkata",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 21,
    hearingDate: "2026-08-20",
    hearingTime: "12:00 PM",
    purpose: "Execution Petition",
    proceduralStage: "Execution",
    status: "LIVE",
    mode: "HYBRID",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-01.mp4" },
    virtualHearing: { provider: "NYAY" },
    previousHearingDate: "2026-08-01",
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Corporate Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Defence", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-004",
    caseId: "NYA-DEMO-BAIL-01122",
    caseNumber: "Bail Appl. 1122/2026",
    caseTitle: "State v. Demo Bail Applicant",
    courtName: "Sessions Court, Darjeeling",
    courtNumber: "3",
    judgeName: "Presiding Judge Demo-03",
    itemNumber: 22,
    hearingDate: "2026-08-20",
    hearingTime: "12:30 PM",
    purpose: "Bail Hearing",
    proceduralStage: "Hearing",
    status: "UPCOMING",
    mode: "VIRTUAL",
    access: "ADVOCATES_ONLY",
    isDemo: true,
    videoSource: { type: "EXTERNAL_MEETING", url: "https://meet.example.com/demo-bail" },
    virtualHearing: {
      provider: "GOOGLE_MEET",
      joinUrl: "https://meet.example.com/demo-bail",
      meetingId: "demo-bail-1122",
    },
    participants: [
      participant("p1", "Presiding Judge Demo-03", "JUDGE"),
      participant("p2", "Adv. Bail Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Public Prosecutor", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-005",
    caseId: "NYA-DL-DEMO-01982",
    caseNumber: "CA 1982/2025",
    caseTitle: "Kapoor Demo Services v. Metro Demo Works",
    courtName: "District & Sessions Court, Central Delhi",
    courtNumber: "2",
    judgeName: "Presiding Judge Demo-05",
    itemNumber: 15,
    hearingDate: "2026-08-20",
    hearingTime: "11:45 AM",
    purpose: "Arguments",
    proceduralStage: "Arguments",
    status: "LIVE",
    mode: "HYBRID",
    access: "PUBLIC",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-01.mp4" },
    virtualHearing: { provider: "NYAY" },
    participants: [
      participant("p1", "Presiding Judge Demo-05", "JUDGE"),
      participant("p2", "Adv. Appellant Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Respondent Counsel", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-006",
    caseId: "NYA-DEMO-FAM-00451",
    caseNumber: "Mat. Pet. 451/2025",
    caseTitle: "Sengupta Demo v. Bose Demo",
    courtName: "Civil Court, Siliguri",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 12,
    hearingDate: "2026-08-20",
    hearingTime: "10:30 AM",
    purpose: "Evidence",
    proceduralStage: "Evidence",
    status: "COMPLETED",
    mode: "PHYSICAL",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    previousHearingDate: "2026-07-20",
    nextHearingDate: "2026-09-10",
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Family Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Opposite Counsel", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-007",
    caseId: "NYA-DEMO-MISC-00612",
    caseNumber: "MA 88/2026",
    caseTitle: "In re Demo Miscellaneous",
    courtName: "District & Sessions Court, Darjeeling",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 13,
    hearingDate: "2026-08-20",
    hearingTime: "10:50 AM",
    purpose: "Miscellaneous Application",
    proceduralStage: "Hearing",
    status: "COMPLETED",
    mode: "VIRTUAL",
    access: "PUBLIC",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-01.mp4" },
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Applicant Counsel", "PETITIONER_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-008",
    caseId: "NYA-WB-DEMO-04821",
    caseNumber: "Crl. Misc. 4821/2026",
    caseTitle: "Sharma v. State of West Bengal",
    courtName: "District & Sessions Court, Darjeeling",
    courtNumber: "3",
    judgeName: "Presiding Judge Demo-03",
    itemNumber: 8,
    hearingDate: "2026-08-20",
    hearingTime: "10:15 AM",
    purpose: "Hearing on application",
    proceduralStage: "Hearing",
    status: "COMPLETED",
    mode: "PHYSICAL",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    previousHearingDate: "2026-08-02",
    nextHearingDate: "2026-08-26",
    participants: [
      participant("p1", "Presiding Judge Demo-03", "JUDGE"),
      participant("p2", "A. Sen", "PETITIONER_ADVOCATE"),
      participant("p3", "Public Prosecutor", "RESPONDENT_ADVOCATE"),
      participant("p4", "Rahul Sharma", "PETITIONER"),
    ],
  },
  {
    id: "hearing-demo-009",
    caseId: "NYA-DEMO-COM-00890",
    caseNumber: "Comm. Suit 890/2025",
    caseTitle: "Harbor Demo Ltd. v. Delta Demo LLP",
    courtName: "Commercial Court, Kolkata",
    courtNumber: "1",
    judgeName: "Presiding Judge Demo-08",
    itemNumber: 5,
    hearingDate: "2026-08-20",
    hearingTime: "10:00 AM",
    purpose: "Case Management",
    proceduralStage: "Hearing",
    status: "ADJOURNED",
    mode: "HYBRID",
    access: "PUBLIC",
    isDemo: true,
    videoSource: { type: "EXTERNAL_MEETING", url: "https://zoom.example.com/j/demo-comm" },
    virtualHearing: {
      provider: "ZOOM",
      joinUrl: "https://zoom.example.com/j/demo-comm",
      meetingId: "demo-comm-890",
      passcode: "demo",
    },
    nextHearingDate: "2026-09-04",
    participants: [
      participant("p1", "Presiding Judge Demo-08", "JUDGE"),
      participant("p2", "Adv. Commercial Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Opposite Side", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-010",
    caseId: "NYA-KA-DEMO-01247",
    caseNumber: "Bail 1247/2026",
    caseTitle: "State v. Demo Applicant",
    courtName: "Bengaluru Rural District & Sessions Court",
    courtNumber: "2",
    judgeName: "Presiding Judge Demo-06",
    itemNumber: 24,
    hearingDate: "2026-08-20",
    hearingTime: "2:00 PM",
    purpose: "Bail Hearing",
    proceduralStage: "Hearing",
    status: "LIVE",
    mode: "VIRTUAL",
    access: "COURT_ONLY",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-02.mp4" },
    virtualHearing: { provider: "NYAY" },
    participants: [
      participant("p1", "Presiding Judge Demo-06", "JUDGE"),
      participant("p2", "Adv. Defence", "PETITIONER_ADVOCATE"),
      participant("p3", "Public Prosecutor", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-011",
    caseId: "NYA-DEMO-APL-00940",
    caseNumber: "CA 940/2025",
    caseTitle: "Banerjee Demo v. Municipal Demo Board",
    courtName: "District Court, Kolkata",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 25,
    hearingDate: "2026-08-21",
    hearingTime: "11:00 AM",
    purpose: "Arguments",
    proceduralStage: "Arguments",
    status: "UPCOMING",
    mode: "PHYSICAL",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Appellant", "PETITIONER_ADVOCATE"),
      participant("p3", "Municipal Counsel", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-012",
    caseId: "NYA-MH-DEMO-03318",
    caseNumber: "Suit 3318/2024",
    caseTitle: "Demo Estates v. Kulkarni Demo",
    courtName: "Nashik District & Sessions Court",
    courtNumber: "1",
    judgeName: "Presiding Judge Demo-07",
    itemNumber: 9,
    hearingDate: "2026-08-22",
    hearingTime: "10:45 AM",
    purpose: "Evidence",
    proceduralStage: "Evidence",
    status: "UPCOMING",
    mode: "VIRTUAL",
    access: "PUBLIC",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-01.mp4" },
    virtualHearing: { provider: "NYAY" },
    participants: [
      participant("p1", "Presiding Judge Demo-07", "JUDGE"),
      participant("p2", "Adv. Plaintiff Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Defendant Counsel", "RESPONDENT_ADVOCATE"),
    ],
  },
  // Dummy LIVE boards — one live matter per remaining court on the demo day
  {
    id: "hearing-demo-live-civil-siliguri",
    caseId: "NYA-DEMO-CIV-LIVE-551",
    caseNumber: "TS 551/2025",
    caseTitle: "Demo Landlord v. Demo Tenant",
    courtName: "Civil Court, Siliguri",
    courtNumber: "2",
    judgeName: "Presiding Judge Demo-02",
    itemNumber: 7,
    hearingDate: "2026-08-20",
    hearingTime: "11:20 AM",
    purpose: "Injunction Application",
    proceduralStage: "Hearing",
    status: "LIVE",
    mode: "VIRTUAL",
    access: "PUBLIC",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-02.mp4" },
    virtualHearing: { provider: "NYAY" },
    participants: [
      participant("p1", "Presiding Judge Demo-02", "JUDGE"),
      participant("p2", "Adv. Plaintiff Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Tenant Counsel", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-live-dsc-darjeeling",
    caseId: "NYA-WB-DEMO-LIVE-2204",
    caseNumber: "Crl. Rev. 2204/2026",
    caseTitle: "Demo Complainant v. State of West Bengal",
    courtName: "District & Sessions Court, Darjeeling",
    courtNumber: "1",
    judgeName: "Presiding Judge Demo-01",
    itemNumber: 4,
    hearingDate: "2026-08-20",
    hearingTime: "11:05 AM",
    purpose: "Revision Petition",
    proceduralStage: "Hearing",
    status: "LIVE",
    mode: "HYBRID",
    access: "PUBLIC",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-01.mp4" },
    virtualHearing: { provider: "NYAY" },
    participants: [
      participant("p1", "Presiding Judge Demo-01", "JUDGE"),
      participant("p2", "Adv. Revision Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Public Prosecutor", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-live-commercial-kolkata",
    caseId: "NYA-DEMO-COM-LIVE-312",
    caseNumber: "Comm. Arb. 312/2026",
    caseTitle: "Orbit Demo Pvt. Ltd. v. Horizon Demo Traders",
    courtName: "Commercial Court, Kolkata",
    courtNumber: "1",
    judgeName: "Presiding Judge Demo-08",
    itemNumber: 3,
    hearingDate: "2026-08-20",
    hearingTime: "11:40 AM",
    purpose: "Interim Relief",
    proceduralStage: "Hearing",
    status: "LIVE",
    mode: "VIRTUAL",
    access: "PUBLIC",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-02.mp4" },
    virtualHearing: { provider: "NYAY" },
    participants: [
      participant("p1", "Presiding Judge Demo-08", "JUDGE"),
      participant("p2", "Adv. Commercial Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Opposite Side", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-live-nashik",
    caseId: "NYA-MH-DEMO-LIVE-1188",
    caseNumber: "SPA 1188/2025",
    caseTitle: "Patil Demo Farms v. Demo Co-op Bank",
    courtName: "Nashik District & Sessions Court",
    courtNumber: "2",
    judgeName: "Presiding Judge Demo-07",
    itemNumber: 11,
    hearingDate: "2026-08-20",
    hearingTime: "11:55 AM",
    purpose: "Special Civil Suit",
    proceduralStage: "Arguments",
    status: "LIVE",
    mode: "HYBRID",
    access: "PUBLIC",
    isDemo: true,
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-01.mp4" },
    virtualHearing: { provider: "NYAY" },
    participants: [
      participant("p1", "Presiding Judge Demo-07", "JUDGE"),
      participant("p2", "Adv. Plaintiff Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Bank Counsel", "RESPONDENT_ADVOCATE"),
    ],
  },
  // Multi-date history for key demo cases (case Hearings tab)
  {
    id: "hearing-demo-04821-past",
    caseId: "NYA-WB-DEMO-04821",
    caseNumber: "Crl. Misc. 4821/2026",
    caseTitle: "Sharma v. State of West Bengal",
    courtName: "District & Sessions Court, Darjeeling",
    courtNumber: "3",
    judgeName: "Presiding Judge Demo-03",
    itemNumber: 11,
    hearingDate: "2026-08-02",
    hearingTime: "11:00 AM",
    purpose: "Notice and appearance",
    proceduralStage: "Notice",
    status: "COMPLETED",
    mode: "PHYSICAL",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    nextHearingDate: "2026-08-12",
    participants: [
      participant("p1", "Presiding Judge Demo-03", "JUDGE"),
      participant("p2", "A. Sen", "PETITIONER_ADVOCATE"),
      participant("p3", "Public Prosecutor", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-04821-order",
    caseId: "NYA-WB-DEMO-04821",
    caseNumber: "Crl. Misc. 4821/2026",
    caseTitle: "Sharma v. State of West Bengal",
    courtName: "District & Sessions Court, Darjeeling",
    courtNumber: "3",
    judgeName: "Presiding Judge Demo-03",
    itemNumber: 6,
    hearingDate: "2026-08-12",
    hearingTime: "10:45 AM",
    purpose: "Order and listing",
    proceduralStage: "Hearing",
    status: "COMPLETED",
    mode: "PHYSICAL",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    previousHearingDate: "2026-08-02",
    nextHearingDate: "2026-08-20",
    participants: [
      participant("p1", "Presiding Judge Demo-03", "JUDGE"),
      participant("p2", "A. Sen", "PETITIONER_ADVOCATE"),
      participant("p3", "Public Prosecutor", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-04821-next",
    caseId: "NYA-WB-DEMO-04821",
    caseNumber: "Crl. Misc. 4821/2026",
    caseTitle: "Sharma v. State of West Bengal",
    courtName: "District & Sessions Court, Darjeeling",
    courtNumber: "3",
    judgeName: "Presiding Judge Demo-03",
    itemNumber: 16,
    hearingDate: "2026-08-26",
    hearingTime: "11:00 AM",
    purpose: "Hearing on application",
    proceduralStage: "Hearing",
    status: "UPCOMING",
    mode: "PHYSICAL",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    previousHearingDate: "2026-08-20",
    participants: [
      participant("p1", "Presiding Judge Demo-03", "JUDGE"),
      participant("p2", "A. Sen", "PETITIONER_ADVOCATE"),
      participant("p3", "Public Prosecutor", "RESPONDENT_ADVOCATE"),
      participant("p4", "Rahul Sharma", "PETITIONER"),
    ],
  },
  {
    id: "hearing-demo-civ-past",
    caseId: "NYA-DEMO-CIV-02031",
    caseNumber: "CS 144/2025",
    caseTitle: "Mehta Properties v. Arun Das",
    courtName: "District Judge Court, Siliguri",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 9,
    hearingDate: "2026-08-05",
    hearingTime: "11:15 AM",
    purpose: "Evidence",
    proceduralStage: "Evidence",
    status: "COMPLETED",
    mode: "PHYSICAL",
    access: "PUBLIC",
    isDemo: true,
    nextHearingDate: "2026-08-12",
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Rahul Mehta", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. A. Sharma", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-civ-mid",
    caseId: "NYA-DEMO-CIV-02031",
    caseNumber: "CS 144/2025",
    caseTitle: "Mehta Properties v. Arun Das",
    courtName: "District Judge Court, Siliguri",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 14,
    hearingDate: "2026-08-12",
    hearingTime: "11:30 AM",
    purpose: "Arguments",
    proceduralStage: "Arguments",
    status: "COMPLETED",
    mode: "HYBRID",
    access: "PUBLIC",
    isDemo: true,
    previousHearingDate: "2026-08-05",
    nextHearingDate: "2026-08-20",
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-01.mp4" },
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Rahul Mehta", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. A. Sharma", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-civ-future",
    caseId: "NYA-DEMO-CIV-02031",
    caseNumber: "CS 144/2025",
    caseTitle: "Mehta Properties v. Arun Das",
    courtName: "District Judge Court, Siliguri",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 20,
    hearingDate: "2026-08-28",
    hearingTime: "11:00 AM",
    purpose: "Order",
    proceduralStage: "Decision",
    status: "UPCOMING",
    mode: "VIRTUAL",
    access: "PUBLIC",
    isDemo: true,
    previousHearingDate: "2026-08-20",
    videoSource: { type: "DEMO_VIDEO", localAsset: "/videos/demo-hearing-01.mp4" },
    virtualHearing: { provider: "NYAY" },
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Rahul Mehta", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. A. Sharma", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-exe-past",
    caseId: "NYA-DEMO-EXE-00714",
    caseNumber: "EP 714/2024",
    caseTitle: "Demo Finance Ltd. v. R. Sen",
    courtName: "District Court, Kolkata",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 7,
    hearingDate: "2026-08-01",
    hearingTime: "12:15 PM",
    purpose: "Appearance",
    proceduralStage: "Execution",
    status: "COMPLETED",
    mode: "PHYSICAL",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    nextHearingDate: "2026-08-20",
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Corporate Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Defence", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-exe-future",
    caseId: "NYA-DEMO-EXE-00714",
    caseNumber: "EP 714/2024",
    caseTitle: "Demo Finance Ltd. v. R. Sen",
    courtName: "District Court, Kolkata",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 19,
    hearingDate: "2026-08-27",
    hearingTime: "12:00 PM",
    purpose: "Further directions",
    proceduralStage: "Execution",
    status: "UPCOMING",
    mode: "PHYSICAL",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    previousHearingDate: "2026-08-20",
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Corporate Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Defence", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-fam-past",
    caseId: "NYA-DEMO-FAM-00451",
    caseNumber: "Mat. Pet. 451/2025",
    caseTitle: "Sengupta Demo v. Bose Demo",
    courtName: "Civil Court, Siliguri",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 4,
    hearingDate: "2026-07-20",
    hearingTime: "10:30 AM",
    purpose: "Evidence",
    proceduralStage: "Evidence",
    status: "COMPLETED",
    mode: "PHYSICAL",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    nextHearingDate: "2026-08-20",
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Family Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Opposite Counsel", "RESPONDENT_ADVOCATE"),
    ],
  },
  {
    id: "hearing-demo-fam-future",
    caseId: "NYA-DEMO-FAM-00451",
    caseNumber: "Mat. Pet. 451/2025",
    caseTitle: "Sengupta Demo v. Bose Demo",
    courtName: "Civil Court, Siliguri",
    courtNumber: "4",
    judgeName: "Presiding Judge Demo-04",
    itemNumber: 10,
    hearingDate: "2026-09-10",
    hearingTime: "10:30 AM",
    purpose: "Further evidence",
    proceduralStage: "Evidence",
    status: "UPCOMING",
    mode: "PHYSICAL",
    access: "CASE_PARTICIPANTS",
    isDemo: true,
    previousHearingDate: "2026-08-20",
    participants: [
      participant("p1", "Presiding Judge Demo-04", "JUDGE"),
      participant("p2", "Adv. Family Counsel", "PETITIONER_ADVOCATE"),
      participant("p3", "Adv. Opposite Counsel", "RESPONDENT_ADVOCATE"),
    ],
  },
];

function readStatusOverrides(): Record<string, HearingStatus> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(statusStorageKey) ?? "{}") as Record<string, HearingStatus>;
  } catch {
    return {};
  }
}

function applyOverrides(hearings: Hearing[]): Hearing[] {
  const overrides = readStatusOverrides();
  return hearings.map((hearing) =>
    overrides[hearing.id] ? { ...hearing, status: overrides[hearing.id] } : hearing
  );
}

export function getJudgeDemoCourtNumber() {
  return JUDGE_DEMO_COURT;
}

export function getAllHearings(): Hearing[] {
  return applyOverrides(seedHearings.map((item) => ({ ...item, participants: item.participants?.map((p) => ({ ...p })) })));
}

export function getHearingById(id: string): Hearing | undefined {
  return getAllHearings().find((hearing) => hearing.id === id || hearing.id.toLowerCase() === id.toLowerCase());
}

export function getHearingsForCase(caseId: string): Hearing[] {
  return getAllHearings().filter((hearing) => hearing.caseId.toLowerCase() === caseId.toLowerCase());
}

function modeFromCase(mode: UnifiedCase["nextHearing"]["mode"]): HearingMode {
  if (mode === "virtual") return "VIRTUAL";
  if (mode === "hybrid") return "HYBRID";
  return "PHYSICAL";
}

/** Chronological hearings for a case; falls back to nextHearing when none are seeded. */
export function getCaseHearingsTimeline(caseId: string, caseData?: UnifiedCase): Hearing[] {
  const listed = sortHearingsChronologically(getHearingsForCase(caseId));
  if (listed.length) return listed;
  if (!caseData) return [];
  const courtroom = caseData.court.courtroom.replace(/^Court\s*/i, "") || undefined;
  return [
    {
      id: `hearing-synth-${caseData.id}`,
      caseId: caseData.id,
      caseNumber: caseData.id,
      caseTitle: caseData.title,
      courtName: caseData.court.name,
      courtNumber: courtroom,
      judgeName: caseData.court.judge,
      hearingDate: caseData.nextHearing.date,
      hearingTime: caseData.nextHearing.time,
      purpose: caseData.nextHearing.purpose,
      proceduralStage: caseData.stage.current,
      status: "UPCOMING",
      mode: modeFromCase(caseData.nextHearing.mode),
      access: "CASE_PARTICIPANTS",
      isDemo: true,
    },
  ];
}

export function getHearingsForDate(date: string): Hearing[] {
  return getAllHearings().filter((hearing) => hearing.hearingDate === date);
}

export function todayIsoKolkata(reference = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(reference);
}

/** Prototype "today" so the bundled demo board is populated regardless of wall-clock date. */
export const DEMO_HEARING_DAY = "2026-08-20";

export function addDaysIso(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getWeekDates(startIso: string) {
  return Array.from({ length: 7 }, (_, index) => addDaysIso(startIso, index));
}

export function filterHearingsByDateRange(
  hearings: Hearing[],
  range: "today" | "tomorrow" | "week" | "custom",
  customDate?: string,
  baseDay = DEMO_HEARING_DAY
) {
  if (range === "today") return hearings.filter((item) => item.hearingDate === baseDay);
  if (range === "tomorrow") return hearings.filter((item) => item.hearingDate === addDaysIso(baseDay, 1));
  if (range === "custom" && customDate) return hearings.filter((item) => item.hearingDate === customDate);
  const week = new Set(getWeekDates(baseDay));
  return hearings.filter((item) => week.has(item.hearingDate));
}

export function groupHearingsByStatus(hearings: Hearing[]) {
  const live = hearings.filter((item) => item.status === "LIVE");
  const upcoming = hearings.filter((item) => item.status === "UPCOMING" || item.status === "WAITING");
  const completed = hearings.filter((item) => item.status === "COMPLETED");
  const adjourned = hearings.filter((item) => item.status === "ADJOURNED");
  const cancelled = hearings.filter((item) => item.status === "CANCELLED");
  return { live, upcoming, completed, adjourned, cancelled };
}

export function sortHearingsChronologically(hearings: Hearing[]) {
  const timeKey = (value?: string) => {
    if (!value) return "99:99";
    const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return value;
    let hour = Number(match[1]);
    if (match[3].toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (match[3].toUpperCase() === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${match[2]}`;
  };
  return [...hearings].sort(
    (a, b) =>
      a.hearingDate.localeCompare(b.hearingDate) ||
      (a.itemNumber ?? 999) - (b.itemNumber ?? 999) ||
      timeKey(a.hearingTime).localeCompare(timeKey(b.hearingTime))
  );
}

/**
 * Role-aware hearing set. Citizen/advocate/other practice roles see the shared demo board.
 * Judges see matters listed in their demo court (Court No. 4) by default.
 */
export function getHearingsForRole(role: Role | null, hearings = getAllHearings()) {
  if (role === "judge") {
    return hearings.filter((item) => item.courtNumber === JUDGE_DEMO_COURT);
  }
  return hearings;
}

export function setHearingLocalStatus(id: string, status: HearingStatus) {
  if (typeof window === "undefined") return;
  const overrides = readStatusOverrides();
  overrides[id] = status;
  window.localStorage.setItem(statusStorageKey, JSON.stringify(overrides));
  window.dispatchEvent(new Event("nyaya-hearing-updated"));
}

export function clearHearingLocalStatuses() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(statusStorageKey);
  window.dispatchEvent(new Event("nyaya-hearing-updated"));
}

export function formatHearingDateLong(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${isoDate}T12:00:00`));
}

export function formatHearingDateShort(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${isoDate}T12:00:00`));
}

export function participantRoleLabel(role: HearingParticipantRole) {
  switch (role) {
    case "JUDGE":
      return "Presiding Judge";
    case "PETITIONER_ADVOCATE":
      return "Petitioner advocate";
    case "RESPONDENT_ADVOCATE":
      return "Respondent advocate";
    case "PETITIONER":
      return "Petitioner";
    case "RESPONDENT":
      return "Respondent";
    case "COURT_STAFF":
      return "Court staff";
    default:
      return "Participant";
  }
}

export function initialsFromName(name: string) {
  const parts = name.replace(/\b(Adv\.|Dr\.|Hon'?ble)\b/gi, "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
