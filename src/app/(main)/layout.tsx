import { AppShell } from "@/components/app-shell";
import type { ReactNode } from "react";
import { PatientProvider } from "@/contexts/patient-context";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
  <PatientProvider>
    <AppShell>{children}</AppShell>
  </PatientProvider>
  );
}
