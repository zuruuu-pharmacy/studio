
import { BackButton } from "@/components/back-button";
import { MoaAnimationClient } from "./moa-animation-client";

export default function MoaAnimationPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">MOA Animation Library</h1>
      <p className="text-muted-foreground mb-6">
        A curated library of short, engaging animations explaining drug mechanisms of action.
      </p>
      <MoaAnimationClient />
    </div>
  );
}
