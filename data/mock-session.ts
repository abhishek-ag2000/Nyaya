import { parseRole, type Role } from "@/data/roles";
export const mockSessionKey = "nyaya-mock-role";
export function getMockRole(): Role | null { if (typeof window === "undefined") return null; const role = parseRole(window.localStorage.getItem(mockSessionKey)); if (role) window.localStorage.setItem(mockSessionKey, role); return role; }
export function setMockRole(role: Role) { if (typeof window !== "undefined") { window.localStorage.setItem(mockSessionKey, role); window.dispatchEvent(new Event("nyaya-mock-session")); } }
export function clearMockRole() { if (typeof window !== "undefined") { window.localStorage.removeItem(mockSessionKey); window.dispatchEvent(new Event("nyaya-mock-session")); } }
