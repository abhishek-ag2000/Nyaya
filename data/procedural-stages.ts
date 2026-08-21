export type StageConfidence = "COURT_CONFIRMED" | "INFERRED_FROM_HISTORY" | "PROCEDURAL_GUIDANCE";

export type ProceduralStage = {
  id: string;
  title: string;
  description: string;
  aliases?: string[];
  optional?: boolean;
  provision?: string;
};

export type ProceduralMapId =
  | "civil-suit"
  | "civil-appeal"
  | "execution-petition"
  | "criminal-trial"
  | "criminal-complaint"
  | "criminal-appeal"
  | "arbitration-case"
  | "misc-application"
  | "guardianship-case"
  | "revision-petition";

export type ProceduralMap = {
  id: ProceduralMapId;
  caseCategory: string;
  label: string;
  source?: string;
  stages: ProceduralStage[];
};

export type ProceduralMapInput = {
  categoryId?: string;
  caseType?: string;
  caseCategory?: string;
  subtype?: string;
};

function stage(id: string, title: string, description: string, aliases: string[] = [], optional = false, provision?: string): ProceduralStage {
  return { id, title, description, aliases, optional, provision };
}

export const civilSuitStages: ProceduralStage[] = [
  stage("cs-plaint", "Presentation of Plaint", "The suit is instituted when the plaintiff presents the plaint in the court of competent jurisdiction.", ["institution", "filing of suit", "fresh suit", "presentation of plaint", "plaint filed", "suit filed", "filed", "institution / filing of suit"], false, "O. VII"),
  stage("cs-summons", "Issue & Service of Summons", "Summons are issued and served on the defendant, calling upon the defendant to appear and answer the claim.", ["issue summons", "issue of summons", "summons to be issued", "summons issued", "issue & service of summons", "service of summons", "summons not received back", "await service", "unserved", "service awaited"], false, "O. V"),
  stage("cs-appearance", "Appearance of Parties", "The parties appear; default may result in dismissal of the suit or an ex-parte proceeding, as the rules require.", ["appearance of parties", "appearance of defendant", "defendant appeared", "ex parte", "ex-parte"], false, "O. IX"),
  stage("cs-ws", "Written Statement", "The defendant files the written statement answering the plaint, ordinarily within the time allowed under Order VIII.", ["written statement", "written statement filed", "ws filed", "ws", "w.s.", "filing of written statement"], false, "O. VIII"),
  stage("cs-documents", "Production of Documents", "The parties produce the documents they rely upon in support of their respective cases.", ["production of documents", "admission and denial", "admission & denial", "a/d of documents", "discovery", "discovery / production of documents"]),
  stage("cs-examination", "Examination of Parties", "The Court examines the parties and records admissions and denials material to the suit.", ["examination of parties", "admission denial", "o10"], false, "O. X"),
  stage("cs-issues", "Framing of Issues", "The Court frames the issues of fact and law on which the parties are at variance and which require adjudication.", ["issues", "framing of issues", "issues framed", "settlement of issues"], false, "O. XIV"),
  stage("cs-witnesses", "Summoning of Witnesses", "Witnesses are summoned for the recording of evidence.", ["summoning of witnesses", "summons to witnesses", "witness summons"], false, "O. XVI"),
  stage("cs-hearing", "Hearing & Examination", "Evidence is recorded, including examination and cross-examination of the witnesses of both sides.", ["hearing and examination", "hearing & examination", "plaintiff evidence", "plaintiff's evidence", "plaintiffs evidence", "pe", "p.e.", "pw", "evidence of plaintiff", "defendant evidence", "defendant's evidence", "defence evidence", "de", "dw", "evidence", "evidence — examination of witnesses"]),
  stage("cs-arguments", "Arguments", "The parties address final submissions on the pleadings, evidence and applicable law.", ["arguments", "argument", "final arguments", "final argument", "oral arguments", "fa"]),
  stage("cs-judgment", "Judgment", "The Court pronounces judgment on the issues, with reasons.", ["judgment", "judgement", "for judgment", "reserved for judgment", "cav", "judgment pronounced"], false, "O. XX"),
  stage("cs-decree", "Decree", "The operative part of the judgment is drawn as a decree capable of execution.", ["decree", "preparation of decree", "decree drawn", "decree prepared"]),
  stage("cs-execution", "Execution", "The decree is enforced in execution, where the decree-holder so proceeds.", ["execution", "execution if required", "execution (if required)", "execution / appeal"], true, "O. XXI")
];

export const executionStages: ProceduralStage[] = [
  stage("ex-filed", "Execution Petition Filed", "Execution application instituted by the decree-holder seeking enforcement of the decree under the applicable provisions of Order XXI CPC.", ["execution petition filed", "ep filed", "e.p. filed", "darkhast filed", "execution application filed", "ex.pet. filed"]),
  stage("ex-notice", "Notice to Judgment-Debtor", "Notice issued to the judgment-debtor where required. Service may be awaited, completed, or contested.", ["notice to judgment debtor", "notice to judgment-debtor", "notice to jd", "notice to j.d.", "jd notice"]),
  stage("ex-objections", "Objections / Reply", "The Court considers objections relating to execution, maintainability, satisfaction, limitation, attachment, or other permissible grounds.", ["objections", "objections if any", "objections (if any)", "objection to execution", "reply to notice"], true),
  stage("ex-mode", "Determination of Mode of Execution", "The Court considers the mode of execution sought and passes appropriate directions for enforcement of the decree.", ["mode of execution", "mode of execution determined", "determination of mode of execution"]),
  stage("ex-process", "Execution Process", "Execution process may include attachment and sale, delivery of possession, arrest/detention where legally permissible, or other process according to the decree.", ["execution process", "attachment", "attachment / arrest / delivery", "attachment and sale", "delivery of possession", "arrest of jd", "arrest / detention", "sale proclamation"]),
  stage("ex-satisfaction", "Satisfaction / Disposal", "The decree is recorded as wholly or partly satisfied, or the execution proceeding is otherwise disposed of.", ["satisfaction of decree", "full satisfaction", "part satisfaction", "disposed", "execution disposed", "satisfaction / disposal"])
];

export const criminalTrialStages: ProceduralStage[] = [
  stage("cr-investigation", "Investigation Commences", "Investigation commences upon information relating to the commission of a cognizable offence.", ["fir", "fir filed", "investigation", "under investigation", "further investigation", "investigation commences", "fir / complaint", "fir / complaint filed"], false, "BNSS s.176"),
  stage("cr-remand", "Remand, if required", "The accused, if in custody, may be remanded pending investigation, as the Magistrate thinks fit.", ["remand", "police remand", "judicial remand", "jc", "pc"], true, "BNSS s.187"),
  stage("cr-chargesheet", "Chargesheet Filed", "The chargesheet or final report is filed in the Magistrate’s Court on completion of investigation.", ["final report", "charge-sheet", "chargesheet", "charge sheet", "police report", "challan", "chargesheet filed"], false, "BNSS s.193(2)"),
  stage("cr-cognizance", "Cognizance by Magistrate", "The Magistrate takes cognizance of the offence upon the police report, if the material so warrants.", ["cognizance", "cognizance taken", "cognisance", "cognizance by magistrate"], false, "BNSS s.210(1)(b)"),
  stage("cr-process", "Summons / Warrant Issued", "Process is issued to secure the appearance of the accused — summons or warrant, as the case requires.", ["issue of process", "issue process", "summons / warrant issued", "summons issued", "warrant issued", "nbw", "bailable warrant", "issue of process — summons/warrant"], false, "BNSS s.227"),
  stage("cr-documents", "Police Report Supplied to Accused", "The police report and accompanying documents are supplied to the accused.", ["supply of documents", "supply of copies", "police report supplied", "section 207", "s.207", "207 crpc", "230 bnss"], false, "BNSS s.230"),
  stage("cr-committal", "Committal to Sessions Court", "Where the offence is exclusively triable by the Court of Session, the Magistrate commits the case.", ["committal", "committed to sessions", "committal to sessions", "committed"], true, "BNSS s.232"),
  stage("cr-plea", "Discharge / Plea", "The Sessions Court considers discharge, or the accused is called upon to plead to the charge.", ["discharge", "plea", "plea before sessions", "plea of accused"], false, "BNSS ss.250, 252"),
  stage("cr-charge", "Framing of Charge", "The Court frames the charge the accused is required to meet.", ["framing of charge", "charge framed", "charge", "consideration / framing of charge or notice"], false, "BNSS s.251"),
  stage("cr-pe", "Prosecution Evidence", "The prosecution examines its witnesses and produces documents in support of the charge.", ["prosecution evidence", "evidence of prosecution", "pw", "pe", "complainant evidence", "evidence"], false, "BNSS s.254"),
  stage("cr-closing", "Closing Purshis", "The prosecution closes its evidence.", ["closing purshis", "purshis", "prosecution closed", "close of prosecution evidence"]),
  stage("cr-statement", "Statement of Accused", "The accused is examined on the incriminating circumstances appearing in evidence.", ["statement of accused", "examination of accused", "accused's further statement", "313", "s.313", "351 bnss", "accused statement", "s.256"], false, "BNSS s.351"),
  stage("cr-de", "Defence Evidence", "The accused may lead defence evidence, or close the case without doing so.", ["defence evidence", "defense evidence", "dw", "accused evidence"], true, "BNSS s.256"),
  stage("cr-arguments", "Arguments", "The prosecution and the defence address the Court on the evidence and the applicable law.", ["arguments", "argument", "final arguments", "final argument", "arguments prosecution", "arguments defence"], false, "BNSS s.257"),
  stage("cr-judgment", "Judgment", "The Court pronounces judgment of acquittal or conviction, with reasons.", ["judgment", "judgement", "acquittal", "conviction", "for judgment", "sentence", "sentencing"])
];

export const criminalComplaintStages: ProceduralStage[] = [
  stage("cc-complaint", "Complaint", "A private complaint is presented to the Magistrate alleging the commission of an offence.", ["complaint", "complaint filed", "private complaint", "complaint case"]),
  stage("cc-examination", "Examination of Complainant / Inquiry", "The complainant is examined and the Magistrate may inquire into the complaint before process is considered.", ["examination of complainant", "inquiry", "enquiry", "sworn statement"]),
  stage("cc-cognizance", "Cognizance", "The Magistrate takes cognizance of the offence if the complaint and inquiry so warrant.", ["cognizance", "cognizance taken", "cognisance"]),
  stage("cc-process", "Issue of Process — Summons/Warrant", "Process is issued to the accused — summons or warrant — if the Magistrate finds sufficient ground.", ["issue of process", "issue process", "summons issued", "warrant issued"]),
  stage("cc-appearance", "Appearance / Bail", "The accused appears; bail is considered where applicable.", ["appearance", "bail", "accused appeared"]),
  stage("cc-documents", "Supply of Documents", "Copies of the complaint and accompanying documents are supplied as required.", ["supply of documents", "supply of copies"]),
  stage("cc-charge", "Consideration / Framing of Charge or Notice", "The Court considers charge or notice of accusation according to whether the case is tried as a warrant or summons case.", ["framing of charge", "charge", "notice of accusation", "substance of accusation"]),
  stage("cc-pe", "Prosecution Evidence", "The complainant / prosecution leads evidence in support of the accusation.", ["prosecution evidence", "complainant evidence", "evidence", "pw"]),
  stage("cc-313", "Statement of Accused", "The accused is examined on the incriminating circumstances appearing in evidence.", ["statement of accused", "313", "examination of accused"]),
  stage("cc-de", "Defence Evidence, if any", "The accused may lead defence evidence, or close the case without doing so.", ["defence evidence", "defense evidence"], true),
  stage("cc-arguments", "Final Arguments", "The parties address the Court on the evidence and the applicable law before judgment.", ["final arguments", "arguments", "argument"]),
  stage("cc-judgment", "Judgment", "The Court pronounces judgment of acquittal or conviction, with reasons.", ["judgment", "judgement", "acquittal", "conviction"]),
  stage("cc-sentence", "Sentence, where applicable", "On conviction, the Court hears the parties on sentence and then awards punishment according to law.", ["sentence", "sentencing"], true),
  stage("cc-aftermath", "Appeal / Revision", "An appeal or revision may be preferred, where provided.", ["appeal", "revision"], true)
];

export const civilAppealStages: ProceduralStage[] = [
  stage("ca-filed", "Appeal Filed", "The memorandum of appeal is presented against the decree or order under challenge.", ["appeal filed", "memorandum of appeal", "fa filed", "rsa filed", "first appeal filed"]),
  stage("ca-scrutiny", "Scrutiny / Registration", "The appeal is scrutinised as to form, limitation and accompanying copies, and registered if found in order.", ["scrutiny", "registration", "registered"]),
  stage("ca-admission", "Admission / Preliminary Hearing", "The appellate court considers whether the appeal is to be admitted for hearing.", ["admission", "admit", "preliminary hearing", "admission hearing"]),
  stage("ca-notice", "Notice to Respondent", "Notice is issued to the respondent to appear and contest the appeal.", ["notice to respondent", "notice issued", "issue notice"]),
  stage("ca-service", "Service / Appearance", "Service of notice is awaited or completed, and the respondent appears or is proceeded against as the rules require.", ["service", "appearance", "respondent appeared", "unserved"]),
  stage("ca-lcr", "Lower Court Record, where required", "The trial-court record is called for, or certified copies are placed, so that the appeal may be heard on the record.", ["lower court record", "lcr", "trial court record", "certified copies called for", "call for record"], true),
  stage("ca-interim", "Interim Applications / Stay, if any", "Incidental applications, including stay of the decree or order, are considered where moved.", ["stay", "interim application", "stay application", "ia", "interim"], true),
  stage("ca-hearing", "Hearing of Appeal", "The appeal is heard on the grounds taken, the record, and the applicable law.", ["hearing of appeal", "hearing", "arguments", "final arguments", "argument"]),
  stage("ca-judgment", "Judgment", "The appellate court pronounces judgment, with reasons, allowing, dismissing, or otherwise disposing of the appeal.", ["judgment", "judgement", "for judgment", "reserved for judgment"]),
  stage("ca-decree", "Final Order / Appellate Decree", "The operative result is drawn as a final order or appellate decree.", ["final order", "appellate decree", "decree", "order"]),
  stage("ca-aftermath", "Further Appeal / Execution, where applicable", "A further appeal may lie where provided, or the decree may proceed in execution.", ["second appeal", "execution", "further appeal"], true)
];

const criminalAppealStages: ProceduralStage[] = [
  stage("cra-filed", "Memorandum of Appeal Filed", "The criminal appeal is presented with the judgment under challenge and the grounds of attack.", ["appeal filed", "memorandum of appeal filed", "crl a filed"]),
  stage("cra-admission", "Admission", "The appellate court considers whether the appeal should be admitted for hearing.", ["admission", "admit"]),
  stage("cra-notice", "Notice to Respondent", "If admitted, notice goes to the respondent to contest the appeal.", ["notice to respondent", "notice"]),
  stage("cra-record", "Certified Copies Called For", "The trial-court record, or certified copies, are called so the appeal can be heard on the record.", ["certified copies called for", "lcr", "call for record"]),
  stage("cra-hearing", "Hearing", "The Court hears the parties on the grounds of appeal and the record.", ["hearing", "arguments"]),
  stage("cra-judgment", "Judgment", "The appellate court pronounces judgment on the appeal.", ["judgment", "judgement"])
];

const arbitrationStages: ProceduralStage[] = [
  stage("arb-filed", "Application Filed (S.9 / S.34)", "The arbitration application is presented to the court competent under the Act.", ["application filed", "s.9", "s.34", "section 9", "section 34"]),
  stage("arb-notice", "Notice to Other Party", "The opposite party is put on notice before interim relief or a challenge to the award is heard.", ["notice to other party", "notice"]),
  stage("arb-hearing", "Hearing", "The court hears both sides on the limited questions the application raises.", ["hearing", "arguments"]),
  stage("arb-order", "Order / Award on Application", "The court passes an order on the application — not a full civil trial on the underlying dispute.", ["order", "award", "order reserved"])
];

const miscApplicationStages: ProceduralStage[] = [
  stage("misc-filed", "Application Filed", "The incidental application is placed on the parent proceeding’s record.", ["application filed", "filed", "petition filed"]),
  stage("misc-notice", "Notice (if required)", "Where the rule so requires, the opposite party is put on notice before orders are passed.", ["notice", "notice if required"], true),
  stage("misc-hearing", "Hearing", "The Court hears the parties on the application.", ["hearing", "arguments", "listed hearing"]),
  stage("misc-order", "Order", "The court allows, refuses, or issues directions on the application.", ["order", "order reserved", "for orders"])
];

const guardianshipStages: ProceduralStage[] = [
  stage("gw-filed", "Petition Filed", "The guardianship petition is presented, usually before the District Judge.", ["petition filed", "filed"]),
  stage("gw-notice", "Notice to Other Guardian / Relatives", "Persons interested in the minor’s welfare are put on notice.", ["notice", "notice to relatives"]),
  stage("gw-inquiry", "Inquiry (if applicable)", "The court may inquire into fitness, welfare, and any competing claim to guardianship.", ["inquiry", "enquiry"], true),
  stage("gw-hearing", "Hearing", "The Court hears the parties on the petition.", ["hearing"]),
  stage("gw-order", "Order of Appointment", "If satisfied, the court appoints a guardian and may issue a certificate of guardianship.", ["order", "appointment", "order of appointment"])
];

const revisionStages: ProceduralStage[] = [
  stage("rev-filed", "Revision Petition Filed", "The revision is presented against the subordinate court’s order.", ["revision petition filed", "revision filed", "crp filed"]),
  stage("rev-admission", "Admission", "The revisional court considers whether the petition should be entertained.", ["admission"]),
  stage("rev-notice", "Notice", "If the revision is entertained, notice goes to the respondent before final hearing.", ["notice"]),
  stage("rev-hearing", "Hearing", "The Court hears the parties on the limited revisional grounds.", ["hearing", "arguments"]),
  stage("rev-order", "Order", "The court allows, dismisses, or otherwise disposes of the revision.", ["order"])
];

export const proceduralMaps: Record<ProceduralMapId, ProceduralMap> = {
  "civil-suit": { id: "civil-suit", caseCategory: "civil-suit", label: "Stages of a civil suit", source: "CPC, 1908", stages: civilSuitStages },
  "civil-appeal": { id: "civil-appeal", caseCategory: "civil-appeal", label: "Civil Appeal", stages: civilAppealStages },
  "execution-petition": { id: "execution-petition", caseCategory: "execution-petition", label: "Execution Petition", stages: executionStages },
  "criminal-trial": { id: "criminal-trial", caseCategory: "criminal-case", label: "Stages in criminal trial", source: "BNSS, 2023", stages: criminalTrialStages },
  "criminal-complaint": { id: "criminal-complaint", caseCategory: "criminal-case", label: "Criminal Complaint Case", stages: criminalComplaintStages },
  "criminal-appeal": { id: "criminal-appeal", caseCategory: "criminal-appeal", label: "Criminal Appeal", stages: criminalAppealStages },
  "arbitration-case": { id: "arbitration-case", caseCategory: "arbitration-case", label: "Arbitration Application", stages: arbitrationStages },
  "misc-application": { id: "misc-application", caseCategory: "misc-application", label: "Miscellaneous Application", stages: miscApplicationStages },
  "guardianship-case": { id: "guardianship-case", caseCategory: "guardianship-case", label: "Guardianship Petition", stages: guardianshipStages },
  "revision-petition": { id: "revision-petition", caseCategory: "revision-petition", label: "Revision Petition", stages: revisionStages }
};

const CATEGORY_ONLY_TERMS = new Set(["execution", "suit", "civil", "criminal", "appeal", "case", "matter", "petition", "application"]);

export function normalizeStageText(value: string) {
  return value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

export function selectProceduralMapId(input: ProceduralMapInput): ProceduralMapId {
  const categoryId = input.categoryId;
  if (categoryId === "civil-suit") return "civil-suit";
  if (categoryId === "civil-appeal") return "civil-appeal";
  if (categoryId === "execution-petition") return "execution-petition";
  if (categoryId === "arbitration-case") return "arbitration-case";
  if (categoryId === "criminal-appeal") return "criminal-appeal";
  if (categoryId === "misc-application") return "misc-application";
  if (categoryId === "guardianship-case") return "guardianship-case";
  if (categoryId === "revision-petition") return "revision-petition";
  if (categoryId === "criminal-case") {
    if (input.subtype === "complaint" || `${input.subtype ?? ""}`.toLowerCase().includes("complaint")) return "criminal-complaint";
    return "criminal-trial";
  }

  const haystack = `${input.categoryId ?? ""} ${input.caseType ?? ""} ${input.caseCategory ?? ""} ${input.subtype ?? ""}`.toLowerCase();
  if (haystack.includes("execution") || haystack.includes("darkhast")) return "execution-petition";
  if (haystack.includes("arbit")) return "arbitration-case";
  if (haystack.includes("guardian")) return "guardianship-case";
  if (haystack.includes("revision")) return "revision-petition";
  if (haystack.includes("appeal") && (haystack.includes("criminal") || haystack.includes("crl"))) return "criminal-appeal";
  if (haystack.includes("appeal")) return "civil-appeal";
  const criminal = haystack.includes("criminal") || haystack.includes("sessions") || haystack.includes("fir") || haystack.includes("crl") || input.categoryId === "criminal-case";
  if (criminal && (input.subtype === "complaint" || haystack.includes("private complaint") || haystack.includes("complaint case")) && !haystack.includes("fir")) return "criminal-complaint";
  const incidental = haystack.includes("misc") || haystack.includes("bail") || /\bia\b/.test(haystack) || (haystack.includes("application") && !criminal);
  const trialLike = haystack.includes("sessions") || haystack.includes("fir") || haystack.includes("warrant") || haystack.includes("summons case") || haystack.includes("complaint case") || haystack.includes("police");
  if (incidental && !trialLike) return "misc-application";
  if (criminal) return "criminal-trial";
  return "civil-suit";
}

export function getProceduralMap(input: ProceduralMapInput): ProceduralMap {
  return proceduralMaps[selectProceduralMapId(input)];
}

export function findStageDescription(title: string) {
  const needle = normalizeStageText(title);
  for (const map of Object.values(proceduralMaps)) {
    for (const item of map.stages) {
      if (normalizeStageText(item.title) === needle) return item.description;
      if (item.aliases?.some((alias) => normalizeStageText(alias) === needle)) return item.description;
    }
  }
  return "A procedural step in this sequence."
}

export function isCategoryOnlyTerm(text: string) {
  return CATEGORY_ONLY_TERMS.has(normalizeStageText(text));
}
