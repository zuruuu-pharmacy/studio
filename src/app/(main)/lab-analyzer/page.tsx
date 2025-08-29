
import { BackButton } from "@/components/back-button";
import { LabAnalyzerClient } from "./lab-analyzer-client";

export default function LabAnalyzerPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Lab Report Analyzer</h1>
        <p className="text-muted-foreground mb-6">
          Upload an image of a lab report to receive a detailed analysis, including abnormal values and recommendations.
        </p>
        <LabAnalyzerClient />
      </div>
  );
}
