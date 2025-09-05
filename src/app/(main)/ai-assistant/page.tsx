
import { BackButton } from "@/components/back-button";
import { AiAssistantClient } from "./ai-assistant-client";

export default function AiAssistantPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Assistant Helper</h1>
      <p className="text-muted-foreground mb-6">
        Ask any pharmacy-related question and get an instant response from Zuruu AI.
      </p>
      <AiAssistantClient />
    </div>
  );
}
