
import { BackButton } from "@/components/back-button";
import { PlagiarismCheckerClient } from "./plagiarism-checker-client";

export default function PlagiarismCheckerPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Plagiarism Checker</h1>
      <p className="text-muted-foreground mb-6">
        Paste your text below to check for similarities against a vast database of academic and web sources.
      </p>
      <PlagiarismCheckerClient />
    </div>
  );
}
