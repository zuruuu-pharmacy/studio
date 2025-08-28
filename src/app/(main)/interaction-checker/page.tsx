
"use client";

import { useState } from "react";
import { InteractionClient } from "./interaction-client";
import { DrugFoodInteractionClient } from "./drug-food-interaction-client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { FlaskConical, Salad } from "lucide-react";

export default function InteractionCheckerPage() {
  const [view, setView] = useState<"menu" | "drug-drug" | "drug-food">("menu");

  const renderContent = () => {
    switch (view) {
      case "drug-drug":
        return <InteractionClient />;
      case "drug-food":
        return <DrugFoodInteractionClient />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Select Interaction Type</h2>
            <p className="text-muted-foreground mb-8">Choose which type of interaction you would like to check.</p>
            <div className="flex justify-center gap-6">
              <Button onClick={() => setView("drug-drug")} size="lg" className="h-24 w-64 flex-col gap-2">
                <FlaskConical className="h-8 w-8" />
                <span>Drug-Drug Interactions</span>
              </Button>
              <Button onClick={() => setView("drug-food")} size="lg" className="h-24 w-64 flex-col gap-2" variant="secondary">
                <Salad className="h-8 w-8" />
                <span>Drug-Food Interactions</span>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Interaction Engine</h1>
        <p className="text-muted-foreground mb-6">
           {view === 'menu' && "Check for drug-drug or drug-food interactions."}
           {view === 'drug-drug' && "Check for pairwise and multi-drug interactions, with severity, mechanism, and suggested actions."}
           {view === 'drug-food' && "Check for interactions between a medication and food."}
        </p>
         {view !== 'menu' && (
            <Button onClick={() => setView('menu')} variant="outline" className="mb-6">
                Back to Selection
            </Button>
        )}
        {renderContent()}
      </div>
    </AppShell>
  );
}
