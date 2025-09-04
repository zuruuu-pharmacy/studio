
'use server';
/**
 * @fileOverview AI-powered flashcard generator from lecture notes.
 *
 * - generateFlashcards - Creates flashcards from a document.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlashcardSchema = z.object({
    front: z.string().describe("The front of the flashcard (a question, term, or concept)."),
    back: z.string().describe("The back of the flashcard (the answer or definition)."),
});

const FlashcardGeneratorInputSchema = z.object({
  noteDataUri: z.string().describe("The lecture note document, as a data URI."),
  topic: z.string().describe("The main topic of the notes (e.g., 'Beta-blockers')."),
  cardCount: z.coerce.number().optional().default(10).describe("The desired number of flashcards."),
});
export type FlashcardGeneratorInput = z.infer<typeof FlashcardGeneratorInputSchema>;

const FlashcardGeneratorOutputSchema = z.object({
    flashcards: z.array(FlashcardSchema),
});
export type FlashcardGeneratorOutput = z.infer<typeof FlashcardGeneratorOutputSchema>;


export async function generateFlashcards(input: FlashcardGeneratorInput): Promise<FlashcardGeneratorOutput> {
  return flashcardGeneratorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'flashcardGeneratorPrompt',
  input: {schema: FlashcardGeneratorInputSchema},
  output: {schema: FlashcardGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert academic AI specializing in creating high-quality, concise flashcards for pharmacy and medical students from their lecture notes.

**Topic:** {{{topic}}}
**Source Document:** {{media url=noteDataUri}}

**Your Task:**
1.  **Analyze the Document:** Carefully read and understand the provided lecture notes.
2.  **Identify Key Concepts:** Extract the most important information suitable for flashcard-based learning. This includes definitions, drug names, mechanisms of action (MOA), therapeutic uses, side effects, key formulas, and classifications.
3.  **Generate Flashcards:** Create a set of exactly {{{cardCount}}} flashcards.
    -   The **front** of the card should be a clear, simple question or a key term (e.g., "What is the MOA of Propranolol?", "Define 'Half-life'").
    -   The **back** of the card should be the concise, accurate answer (e.g., "Non-selective beta-adrenergic antagonist that blocks both β1 and β2 receptors.", "Time required for the drug concentration in the plasma to decrease by half.").
4.  **Format:** Ensure the output is a structured JSON array of flashcards.

Focus on creating cards that test a single, specific piece of information, as this is most effective for active recall.
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


