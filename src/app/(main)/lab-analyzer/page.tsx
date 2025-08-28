import { LabAnalyzerClient } from "./lab-analyzer-client";
import { AppShell } from "@/components/app-shell";

export default function LabAnalyzerPage() {
  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Lab Report Analyzer</h1>
        <p className="text-muted-foreground mb-6">
          Paste a lab report to receive a detailed analysis, including abnormal values and recommendations.
        </p>
        <LabAnalyzerClient />
      </div>
    </AppShell>
  );
}
