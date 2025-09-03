
'use server';
/**
 * @fileOverview AI-powered word search puzzle generator for pharma games.
 *
 * - generateWordSearch - Creates a word search puzzle based on a topic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WordSearchGeneratorInputSchema = z.object({
  topic: z.string().describe("The topic for the word search (e.g., 'Antibiotics', 'Cardiovascular Drugs')."),
  size: z.coerce.number().optional().default(12).describe("The desired grid size (e.g., 12 for a 12x12 grid)."),
  wordCount: z.coerce.number().optional().default(10).describe("The approximate number of words to include."),
});
export type WordSearchGeneratorInput = z.infer<typeof WordSearchGeneratorInputSchema>;

const WordSchema = z.object({
  word: z.string().describe("A word hidden in the grid, in uppercase."),
  // As a future enhancement, we could ask for coordinates, but that makes the prompt much harder.
  // For now, we'll just get the words. If we need a "reveal" feature, we'll need to enhance this.
});


const WordSearchGeneratorOutputSchema = z.object({
  grid: z.array(z.array(z.string())).describe("The 2D grid of letters."),
  words: z.array(z.string()).describe("The list of words hidden in the grid, in uppercase."),
  topic: z.string(),
});
export type WordSearchGeneratorOutput = z.infer<typeof WordSearchGeneratorOutputSchema>;

export async function generateWordSearch(input: WordSearchGeneratorInput): Promise<WordSearchGeneratorOutput> {
  return wordSearchGeneratorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'wordSearchGeneratorPrompt',
  input: {schema: WordSearchGeneratorInputSchema},
  output: {schema: WordSearchGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert puzzle maker specializing in pharmacology.
Your task is to generate a complete, valid word search puzzle based on a given topic.

**Topic:** {{{topic}}}
**Grid Size:** {{{size}}}x{{{size}}}
**Word Count:** Approximately {{{wordCount}}} words

**CRITICAL Instructions:**
1.  **Word Selection FIRST:** First, you MUST choose exactly {{{wordCount}}} important and relevant drug names or terms related to the topic '{{{topic}}}'. The words must be in ALL UPPERCASE. This list is the source of truth.
2.  **Grid Generation SECOND:** Next, create a valid {{{size}}}x{{{size}}} word search grid. You MUST place all the words you selected in step 1 into this grid. Words can be placed horizontally, vertically, or diagonally, and can be spelled forwards or backwards.
3.  **Fill Remaining Spaces:** Fill any remaining empty spaces in the grid with random uppercase letters.
4.  **Word List:** The 'words' array in your output MUST be the exact same list of words you selected in step 1.
5.  **Validation:** It is absolutely critical that every word from the 'words' list is actually present and correctly spelled in the 'grid'.
6.  **Topic Echo:** Return the original topic in the output.

The final JSON output must be perfectly structured according to the schema. The puzzle must be solvable.
`,
});


const wordSearchGeneratorFlow = ai.defineFlow(
  {
    name: 'wordSearchGeneratorFlow',
    inputSchema: WordSearchGeneratorInputSchema,
    outputSchema: WordSearchGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
