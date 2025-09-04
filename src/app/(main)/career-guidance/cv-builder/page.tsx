
import { BackButton } from "@/components/back-button";
import { CvBuilderClient } from "./cv-builder-client";
import { Suspense } from "react";

export default function CvBuilderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Pharmacy CV Builder</h1>
        <p className="text-muted-foreground mb-6">
          Build a professional CV tailored for pharmacy roles. Your profile data is pre-filled to get you started.
        </p>
        <CvBuilderClient />
      </div>
    </Suspense>
  );
}
