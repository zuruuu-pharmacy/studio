
'use server';
/**
 * @fileOverview AI-powered matching game generator for pharma games.
 *
 * - generateMatchingGame - Creates pairs of items for a matching game.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GamePairSchema = z.object({
  item1: z.string().describe("The first item in the pair (e.g., a drug name)."),
  item2: z.string().describe("The second item in the pair (e.g., its mechanism of action)."),
});

const MatchingGameInputSchema = z.object({
  topic: z.string().describe("The topic for the game (e.g., 'Antibiotics', 'Diuretics')."),
  count: z.coerce.number().optional().default(6).describe("The desired number of pairs."),
});
export type MatchingGameInput = z.infer<typeof MatchingGameInputSchema>;

const MatchingGameOutputSchema = z.object({
  topic: z.string(),
  pairs: z.array(GamePairSchema),
  column1Title: z.string().describe("The title for the first column (e.g., 'Drug Name')."),
  column2Title: z.string().describe("The title for the second column (e.g., 'Mechanism of Action')."),
});
export type MatchingGameOutput = z.infer<typeof MatchingGameOutputSchema>;

export async function generateMatchingGame(input: MatchingGameInput): Promise<MatchingGameOutput> {
  return matchingGameGeneratorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'matchingGameGeneratorPrompt',
  input: {schema: MatchingGameInputSchema},
  output: {schema: MatchingGameOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a creative AI for a pharmacy education game. Your task is to generate a list of pairs for a matching game based on a specific topic.

**Topic:** {{{topic}}}
**Number of Pairs:** {{{count}}}

**Instructions:**
1.  **Identify Core Concepts:** Based on the topic, determine a logical set of pairs. The most common format is "Drug Name" and "Mechanism of Action", but it could also be "Plant Name" and "Active Constituent", or "Disease" and "First-line Treatment".
2.  **Generate Pairs:** Create exactly {{{count}}} unique and accurate pairs.
3.  **Define Column Titles:** Provide clear titles for what each column represents (e.g., "Drug Name" for the first column, "Mechanism of Action" for the second).
4.  **Topic Echo:** Return the original topic in the output.

Respond ONLY with the structured JSON output.
`,
});


const matchingGameGeneratorFlow = ai.defineFlow(
  {
    name: 'matchingGameGeneratorFlow',
    inputSchema: MatchingGameInputSchema,
    outputSchema: MatchingGameOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
