export type DemoCourtData = { state: string; code: string; pending: string; courts: number; averageAge: string; trend: "up" | "down"; note: string };

// Entirely synthetic, illustrative prototype values. No live source or government system is used.
export const demoCourtData: DemoCourtData[] = [
  { state: "Delhi", code: "DL", pending: "1.7 lakh", courts: 48, averageAge: "2.9 years", trend: "down", note: "Default synthetic preview" },
  { state: "Maharashtra", code: "MH", pending: "5.2 lakh", courts: 174, averageAge: "3.4 years", trend: "up", note: "Synthetic demo profile" },
  { state: "Karnataka", code: "KA", pending: "2.8 lakh", courts: 128, averageAge: "3.1 years", trend: "down", note: "Synthetic demo profile" },
  { state: "West Bengal", code: "WB", pending: "3.6 lakh", courts: 112, averageAge: "3.8 years", trend: "up", note: "Synthetic demo profile" },
  { state: "Tamil Nadu", code: "TN", pending: "2.1 lakh", courts: 139, averageAge: "2.7 years", trend: "down", note: "Synthetic demo profile" },
  { state: "Uttar Pradesh", code: "UP", pending: "6.4 lakh", courts: 218, averageAge: "4.2 years", trend: "up", note: "Synthetic demo profile" },
  { state: "Rajasthan", code: "RJ", pending: "2.3 lakh", courts: 96, averageAge: "3.6 years", trend: "down", note: "Synthetic demo profile" },
  { state: "Kerala", code: "KL", pending: "1.1 lakh", courts: 54, averageAge: "2.5 years", trend: "down", note: "Synthetic demo profile" }
];
