
import { BackButton } from "@/components/back-button";
import { VirtualLabSimulatorClient } from "./virtual-lab-simulator-client";

export default function VirtualLabSimulatorPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Virtual Lab Simulator</h1>
      <p className="text-muted-foreground mb-6">
        Run a narrative-based simulation of a lab experiment. Enter an experiment title to begin.
      </p>
      <VirtualLabSimulatorClient />
    </div>
  );
}
