"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMockRole } from "@/data/mock-session";
import { roleHome, type Role } from "@/data/roles";

export default function AdvocateOnly({
  children,
  action,
}: {
  children: React.ReactNode;
  action: string;
}) {
  void action;
  const router = useRouter();
  const [role, setRole] = useState<Role | null | undefined>(undefined);

  useEffect(() => {
    const refresh = () => setRole(getMockRole());
    refresh();
    window.addEventListener("nyaya-mock-session", refresh);
    return () => window.removeEventListener("nyaya-mock-session", refresh);
  }, []);

  useEffect(() => {
    if (role === undefined) return;
    if (!role) {
      router.replace("/login");
      return;
    }
    if (role !== "advocate") router.replace(roleHome(role));
  }, [role, router]);

  if (role !== "advocate") {
    return <main className="wrap workspace-loading">Loading workspace…</main>;
  }

  return <>{children}</>;
}
