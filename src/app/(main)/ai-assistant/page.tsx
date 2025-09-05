
import { BackButton } from "@/components/back-button";
import { AiAssistantClient } from "./ai-assistant-client";

export default function AiAssistantPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Smart Search</h1>
      <p className="text-muted-foreground mb-6">
        Ask any pharmacy-related question and get a comprehensive, synthesized response from Zuruu AI.
      </p>
      <AiAssistantClient />
    </div>
  );
}
