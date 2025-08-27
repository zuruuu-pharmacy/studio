import { MonographClient } from "./monograph-client";
import { AppShell } from "@/components/app-shell";

export default function MonographPage() {
  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold mb-2 font-headline">Drug Monograph Lookup</h1>
        <p className="text-muted-foreground mb-6">
          Enter a drug name to get a comprehensive monograph.
        </p>
        <MonographClient />
      </div>
    </AppShell>
  );
}
