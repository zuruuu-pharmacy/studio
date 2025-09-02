
import { BackButton } from "@/components/back-button";
import { NutritionCoachClient } from "./nutrition-coach-client";

export default function NutritionCoachPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Nutrition Coach</h1>
        <p className="text-muted-foreground mb-6">
          Answer the questionnaire to receive a personalized, AI-generated diet and lifestyle plan.
        </p>
        <NutritionCoachClient />
      </div>
  );
}
