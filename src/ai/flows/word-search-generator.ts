
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

**Instructions:**
1.  **Word Selection:** Choose around {{{wordCount}}} important and relevant drug names or terms related to the topic '{{{topic}}}'. The words must be in ALL UPPERCASE.
2.  **Grid Generation:** Create a valid {{{size}}}x{{{size}}} word search grid.
    *   Place the selected words within the grid. Words can be placed horizontally, vertically, or diagonally, and can be spelled forwards or backwards.
    *   Fill any remaining empty spaces in the grid with random uppercase letters.
3.  **Word List:** Provide a list of the exact words that are hidden in the grid.
4.  **Validation:** Ensure that all words from the 'words' list are actually present in the 'grid'.
5.  **Topic Echo:** Return the original topic in the output.

The final JSON output must be perfectly structured according to the schema.
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
