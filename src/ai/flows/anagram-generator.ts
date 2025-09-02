
'use server';
/**
 * @fileOverview AI-powered anagram generator for pharma games.
 *
 * - generateAnagrams - Creates a list of drug name anagrams based on a topic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnagramSchema = z.object({
    anagram: z.string().describe("The scrambled drug name. Must be uppercase."),
    answer: z.string().describe("The correct, unscrambled drug name."),
    clue: z.string().describe("A short clue, such as the drug's class or a key use."),
});

const AnagramGeneratorInputSchema = z.object({
  topic: z.string().describe("The topic for the anagrams (e.g., 'Antibiotics', 'Cardiovascular Drugs')."),
  count: z.coerce.number().optional().default(10).describe("The desired number of anagrams."),
});
export type AnagramGeneratorInput = z.infer<typeof AnagramGeneratorInputSchema>;

const AnagramGeneratorOutputSchema = z.object({
    anagrams: z.array(AnagramSchema),
});
export type AnagramGeneratorOutput = z.infer<typeof AnagramGeneratorOutputSchema>;


export async function generateAnagrams(input: AnagramGeneratorInput): Promise<AnagramGeneratorOutput> {
  return anagramGeneratorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'anagramGeneratorPrompt',
  input: {schema: AnagramGeneratorInputSchema},
  output: {schema: AnagramGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a creative AI for a pharmacy education game. Your task is to generate a list of challenging and fun anagrams from drug names related to a specific topic.

**Topic:** {{{topic}}}
**Number of Anagrams:** {{{count}}}

**Instructions:**
1.  **Select Drugs:** Choose {{{count}}} well-known drugs relevant to the topic '{{{topic}}}'.
2.  **Create Anagrams:** For each drug, create an anagram by scrambling its letters. The anagram MUST be in all uppercase letters.
3.  **Provide Answers:** The 'answer' field must be the correct, unscrambled drug name (properly capitalized).
4.  **Create Clues:** For each drug, provide a short, helpful clue (e.g., its class, a primary use).
5.  **Ensure Accuracy:** Double-check that the anagram contains the exact same letters as the answer.

Respond ONLY with the structured JSON output.
`,
});


const anagramGeneratorFlow = ai.defineFlow(
  {
    name: 'anagramGeneratorFlow',
    inputSchema: AnagramGeneratorInputSchema,
    outputSchema: AnagramGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
