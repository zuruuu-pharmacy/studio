
'use server';
/**
 * @fileOverview AI-powered generator for flashcards from a drug card.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlashcardGeneratorInputSchema = z.object({
  drugName: z.string(),
  moa: z.string(),
  brandNames: z.string(),
});
export type FlashcardGeneratorInput = z.infer<typeof FlashcardGeneratorInputSchema>;

const FlashcardSchema = z.object({
    front: z.string().describe("The front of the flashcard (a question or term)."),
    back: z.string().describe("The back of the flashcard (the answer or definition)."),
});

const FlashcardGeneratorOutputSchema = z.object({
    flashcards: z.array(FlashcardSchema),
});
export type FlashcardGeneratorOutput = z.infer<typeof FlashcardGeneratorOutputSchema>;

export async function generateFlashcardsFromDrug(input: FlashcardGeneratorInput): Promise<FlashcardGeneratorOutput> {
  return flashcardGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'drugFlashcardGeneratorPrompt',
  input: {schema: FlashcardGeneratorInputSchema},
  output: {schema: FlashcardGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert pharmacology flashcard creator.
Your task is to create a set of 2-3 high-yield flashcards based on the provided drug information.

**Drug Information:**
-   **Drug Name:** {{{drugName}}}
-   **Mechanism of Action (MOA):** {{{moa}}}
-   **Brand Names:** {{{brandNames}}}

**Instructions:**
1.  Create a flashcard with the MOA on the front and the drug name on the back.
2.  Create a flashcard with "Brand names for {{{drugName}}}?" on the front and the list of brand names on the back.
3.  If possible, create one more simple question/answer flashcard based on the MOA.

Respond ONLY with the structured JSON output.
`,
});

const flashcardGeneratorFlow = ai.defineFlow(
  {
    name: 'flashcardGeneratorFlow',
    inputSchema: FlashcardGeneratorInputSchema,
    outputSchema: FlashcardGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
