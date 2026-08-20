"use client";
import { useRouter } from "next/navigation";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { setMockRole } from "@/data/mock-session";
import { roleConfig, roleHome, type Role } from "@/data/roles";

const roles: Role[] = ["citizen", "advocate", "judge", "registry", "stenographer", "police"];

export default function DemoLogin() {
  const router = useRouter();

  return (
    <section className="auth-card">
      <h2>
        <ShieldCheck aria-hidden="true" />
        Open a demo session
      </h2>
      <p>Select a preconfigured, role. No authentication code, identity number, or external system is used.</p>
      <div className="demo-role-links">
        {roles.map((role) => {
          const Icon = roleConfig[role].icon;
          return (
            <button
              key={role}
              type="button"
              onClick={() => {
                setMockRole(role);
                router.push(roleHome(role));
              }}
            >
              <span className="role-icon">
                <Icon aria-hidden="true" />
              </span>
              {roleConfig[role].label}
              <span>
                <ChevronRight aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
