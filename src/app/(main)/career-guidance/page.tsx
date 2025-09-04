
import { BackButton } from "@/components/back-button";
import { CareerGuidanceClient } from "./career-guidance-client";

export default function CareerGuidancePage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Career Guidance</h1>
      <p className="text-muted-foreground mb-6">
        Explore various career paths in the field of pharmacy and discover your professional journey.
      </p>
      <CareerGuidanceClient />
    </div>
  );
}
