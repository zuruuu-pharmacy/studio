
'use server';
/**
 * @fileOverview AI-powered e-library search for instant definitions.
 *
 * - searchELibrary - A function that handles the e-library search process.
 * - ESearchParams - The input type for the searchELibrary function.
 * - SearchResult - The return type for the searchELibrary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ESearchParamsSchema = z.object({
  query: z.string().describe('The search term, e.g., a drug name, medical concept, or formula.'),
});
export type ESearchParams = z.infer<typeof ESearchParamsSchema>;

const SearchResultSchema = z.object({
  term: z.string().describe('The term that was defined.'),
  definition: z.string().describe('A clear, concise definition of the term.'),
  formula: z.string().optional().describe('A relevant formula, if applicable (e.g., for bioavailability or clearance).'),
  example: z.string().optional().describe('A practical example of the term in a clinical or pharmaceutical context.'),
  exam_importance: z.string().optional().describe('A tag indicating the term\'s relevance for exams (e.g., "High-yield topic", "Commonly asked in pharmacokinetics").'),
  related_topics: z.array(z.string()).optional().describe('A list of 2-3 related topics for further study.'),
});
export type SearchResult = z.infer<typeof SearchResultSchema>;


export async function searchELibrary(input: ESearchParams): Promise<SearchResult> {
  return eLibrarySearchFlow(input);
}


const prompt = ai.definePrompt({
  name: 'eLibrarySearchPrompt',
  input: {schema: ESearchParamsSchema},
  output: {schema: SearchResultSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert AI librarian and pharmacy tutor. A student has searched for a term in the e-library. Your task is to provide a concise, structured, and informative "definition card" for the search query.

**Search Query:** {{{query}}}

**Instructions:**
1.  **Term:** Echo back the query term.
2.  **Definition:** Provide a clear, easy-to-understand definition suitable for a pharmacy student.
3.  **Formula:** If the term is a concept that has a standard formula (like Clearance, Bioavailability, Half-life), provide it. Otherwise, omit this field.
4.  **Example:** Give a highly relevant and practical example. For a drug, mention its class and a key use. For a concept, explain it with a common drug example.
5.  **Exam Importance:** Add a short note on how important this topic is for exams (e.g., "High-yield topic for pharmacology finals," "Frequently asked in viva voce exams," "Fundamental concept in pharmaceutics").
6.  **Related Topics:** Suggest 2-3 other related terms or concepts the student should study next.

Respond ONLY with the structured JSON format.`,
});


const eLibrarySearchFlow = ai.defineFlow(
  {
    name: 'eLibrarySearchFlow',
    inputSchema: ESearchParamsSchema,
    outputSchema: SearchResultSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);




