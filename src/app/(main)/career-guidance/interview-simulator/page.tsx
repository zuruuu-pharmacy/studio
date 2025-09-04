
import { BackButton } from "@/components/back-button";
import { InterviewSimulatorClient } from "./interview-simulator-client";

export default function InterviewSimulatorPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Interview Simulator</h1>
      <p className="text-muted-foreground mb-6">
        Practice common interview questions and get a feel for a real interview scenario.
      </p>
      <InterviewSimulatorClient />
    </div>
  );
}
