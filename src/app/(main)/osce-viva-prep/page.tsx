
"use client";

import { BackButton } from "@/components/back-button";
import { OsceVivaPrepClient } from "./osce-viva-prep-client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ReviewModeClient } from "./review-mode-client";

function OsceVivaPrepContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');

    if (mode === 'review') {
        return <ReviewModeClient />;
    }

    return <OsceVivaPrepClient />;
}


export default function OsceVivaPrepPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">OSCE and Viva Preparation</h1>
        <p className="text-muted-foreground mb-6">
          Practice for your exams with AI-driven OSCE and viva scenarios. Enter a topic to start a station.
        </p>
        <OsceVivaPrepContent />
      </div>
    </Suspense>
  );
}
