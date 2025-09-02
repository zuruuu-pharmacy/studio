
import { BackButton } from "@/components/back-button";
import { McqBankClient } from "./mcq-bank-client";

export default function McqBankPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI-Powered MCQ Bank</h1>
      <p className="text-muted-foreground mb-6">
        Enter any topic to generate a practice quiz with detailed explanations.
      </p>
      <McqBankClient />
    </div>
  );
}
