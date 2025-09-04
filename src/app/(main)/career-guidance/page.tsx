
import { BackButton } from "@/components/back-button";
import { CareerGuidanceClient } from "./career-guidance-client";
import { Suspense } from "react";

export default function CareerGuidancePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <div>
            <BackButton />
            <h1 className="text-3xl font-bold mb-2 font-headline">Career Hub</h1>
            <p className="text-muted-foreground mb-6">
                Your personalized guide to a successful career in pharmacy.
            </p>
            <CareerGuidanceClient />
        </div>
    </Suspense>
  );
}
