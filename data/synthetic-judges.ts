export type SyntheticJudge = {
  id: string;
  name: string;
  designation: string;
  court: string;
  state: string;
  district: string;
  jurisdiction: string[];
  courtroom: string;
  sitting: string;
  caseIds: string[];
};

// Fictional profiles for interface demonstration only. These are not judicial records.
export const syntheticJudges: SyntheticJudge[] = [
  { id:"JDG-DEMO-001", name:"Presiding Judge Demo-03 (synthetic)", designation:"District & Sessions Judge", court:"District & Sessions Court, Darjeeling (Prototype)", state:"West Bengal", district:"Darjeeling", jurisdiction:["Criminal matters","Sessions trials"], courtroom:"Court 3", sitting:"10:30 AM – 4:30 PM", caseIds:["NYA-WB-DEMO-04821"] },
  { id:"JDG-DEMO-002", name:"Presiding Judge Demo-04 (synthetic)", designation:"Additional District Judge", court:"Civil Court, Siliguri (Prototype)", state:"West Bengal", district:"Darjeeling", jurisdiction:["Civil suits","Execution proceedings"], courtroom:"Court 2", sitting:"10:30 AM – 4:00 PM", caseIds:["NYA-DEMO-CIV-02031","NYA-DEMO-EXE-00714","NYA-DEMO-CRM-00109"] },
  { id:"JDG-DEMO-003", name:"Presiding Judge Demo-05 (synthetic)", designation:"District Judge", court:"District & Sessions Court, Central Delhi (Prototype)", state:"Delhi", district:"Central Delhi", jurisdiction:["Civil appeals","Commercial matters"], courtroom:"Court 5", sitting:"10:00 AM – 4:00 PM", caseIds:["NYA-DL-DEMO-01982"] },
  { id:"JDG-DEMO-004", name:"Presiding Judge Demo-06 (synthetic)", designation:"Sessions Judge", court:"Bengaluru Rural District & Sessions Court (Prototype)", state:"Karnataka", district:"Bengaluru Rural", jurisdiction:["Bail matters","Criminal trials"], courtroom:"Court 4", sitting:"10:30 AM – 4:30 PM", caseIds:["NYA-KA-DEMO-01247"] },
  { id:"JDG-DEMO-005", name:"Presiding Judge Demo-07 (synthetic)", designation:"Civil Judge, Senior Division", court:"Nashik District & Sessions Court (Prototype)", state:"Maharashtra", district:"Nashik", jurisdiction:["Property suits","Civil evidence"], courtroom:"Court 7", sitting:"11:00 AM – 5:00 PM", caseIds:["NYA-MH-DEMO-03318"] },
  { id:"JDG-DEMO-006", name:"Presiding Judge Demo-08 (synthetic)", designation:"Commercial Court Judge", court:"Commercial Court, Kolkata (Prototype)", state:"West Bengal", district:"Kolkata", jurisdiction:["Arbitration","Commercial disputes"], courtroom:"Commercial Court 1", sitting:"10:30 AM – 4:30 PM", caseIds:["NYA-DEMO-ARB-00386"] }
];
