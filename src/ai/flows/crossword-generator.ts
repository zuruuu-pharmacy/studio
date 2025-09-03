
'use server';
/**
 * @fileOverview AI-powered crossword puzzle generator for pharma games.
 *
 * - generateCrossword - Creates a crossword puzzle based on a topic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GridCellSchema = z.object({
  letter: z.string().nullable().describe("The letter in this cell. Null if it's a black square."),
  number: z.number().nullable().describe("The number for the start of a word, if any."),
});

const ClueSchema = z.object({
  number: z.number().describe("The number corresponding to the grid."),
  clue: z.string().describe("The clue for the word."),
  answer: z.string().describe("The correct answer."),
});

const CrosswordGeneratorInputSchema = z.object({
  topic: z.string().describe("The topic for the crossword (e.g., 'Antibiotics', 'Cardiovascular Drugs')."),
  size: z.coerce.number().optional().default(10).describe("The desired grid size (e.g., 10 for a 10x10 grid)."),
  wordCount: z.coerce.number().optional().default(8).describe("The approximate number of words to include."),
});
export type CrosswordGeneratorInput = z.infer<typeof CrosswordGeneratorInputSchema>;

const CrosswordGeneratorOutputSchema = z.object({
  grid: z.array(z.array(GridCellSchema)).describe("The 2D grid representing the puzzle."),
  clues: z.object({
    across: z.array(ClueSchema),
    down: z.array(ClueSchema),
  }),
  topic: z.string(),
});
export type CrosswordGeneratorOutput = z.infer<typeof CrosswordGeneratorOutputSchema>;

export async function generateCrossword(input: CrosswordGeneratorInput): Promise<CrosswordGeneratorOutput> {
  return crosswordGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crosswordGeneratorPrompt',
  input: {schema: CrosswordGeneratorInputSchema},
  output: {schema: CrosswordGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert puzzle maker specializing in pharmacology and medical sciences.
Your task is to generate a complete, valid, and challenging crossword puzzle based on a given topic.

**Topic:** {{{topic}}}
**Grid Size:** {{{size}}}x{{{size}}}
**Word Count:** Approximately {{{wordCount}}} words

**Instructions:**
1.  **Word Selection:** Choose around {{{wordCount}}} important and relevant drug names, terms, or concepts related to the topic '{{{topic}}}'. The words must be of varying lengths.
2.  **Grid Generation:** Arrange these words into a valid {{{size}}}x{{{size}}} crossword grid.
    *   This grid should be represented as a 2D array of objects.
    *   Each object must have a 'letter' (a single uppercase character, or null for a black/empty square) and a 'number' (the starting number of a word, or null).
    *   The grid must be a perfect square of {{{size}}} by {{{size}}}.
3.  **Numbering:** Number the grid cells where words begin, starting from 1. A single cell can be the start of both an "across" and a "down" word.
4.  **Clue Generation:** For each word in the grid, create a concise and accurate clue.
    *   Separate clues into "across" and "down" lists.
    *   Each clue object must contain the 'number', the 'clue' text, and the 'answer' (the word itself, in uppercase).
5.  **Validation:** Ensure that every letter in the grid is part of both an "across" and a "down" word, unless it's an endpoint. The generated puzzle MUST be solvable.
6.  **Topic Echo:** Return the original topic in the output.

The final JSON output must be perfectly structured according to the schema. This is critical.
`,
});

const crosswordGeneratorFlow = ai.defineFlow(
  {
    name: 'crosswordGeneratorFlow',
    inputSchema: CrosswordGeneratorInputSchema,
    outputSchema: CrosswordGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Add post-processing or validation here if needed in the future
    return output!;
  }
);
