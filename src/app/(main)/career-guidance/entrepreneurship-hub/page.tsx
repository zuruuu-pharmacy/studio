
import { BackButton } from "@/components/back-button";
import { EntrepreneurshipHubClient } from "./entrepreneurship-hub-client";

export default function EntrepreneurshipHubPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Entrepreneurship Hub</h1>
      <p className="text-muted-foreground mb-6">
        Explore pathways to starting your own venture, from idea to execution.
      </p>
      <EntrepreneurshipHubClient />
    </div>
  );
}
