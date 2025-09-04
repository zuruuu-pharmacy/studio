
'use server';
/**
 * @fileOverview AI-powered reference and citation generator.
 *
 * - generateReference - A function that creates a formatted citation for a given text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReferenceGeneratorInputSchema = z.object({
  sourceIdentifier: z.string().min(10, "Please provide a valid DOI, PMID, or URL.").describe("The DOI, PMID, or URL of the article to cite."),
  style: z.enum(['Vancouver', 'APA', 'Harvard', 'MLA']).describe("The desired citation style."),
});
export type ReferenceGeneratorInput = z.infer<typeof ReferenceGeneratorInputSchema>;

const ReferenceGeneratorOutputSchema = z.object({
  formattedCitation: z.string().describe("The fully formatted citation in the requested style."),
  explanation: z.string().describe("A brief explanation of why this reference is appropriate for the given text."),
});
export type ReferenceGeneratorOutput = z.infer<typeof ReferenceGeneratorOutputSchema>;

export async function generateReference(input: ReferenceGeneratorInput): Promise<ReferenceGeneratorOutput> {
  return referenceGeneratorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'referenceGeneratorPrompt',
  input: {schema: ReferenceGeneratorInputSchema},
  output: {schema: ReferenceGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert academic librarian and citation specialist. Your task is to find the full citation details for a given source identifier (DOI, PMID, or URL) and format it correctly in the specified citation style.

**Source Identifier (DOI, PMID, or URL):**
"{{{sourceIdentifier}}}"

**Citation Style:**
{{{style}}}

**Instructions:**
1.  **Identify the Source:** Analyze the "sourceIdentifier" to find the specific academic article, book, or webpage.
2.  **Find Full Details:** Based on your knowledge and access to information, retrieve all necessary citation details (authors, title, journal, year, volume, pages, etc.).
3.  **Format Citation:** Format the full reference perfectly according to the rules of the selected '{{{style}}}' style.
4.  **Explain Your Choice:** In the 'explanation' field, briefly confirm the source you found (e.g., "This citation is for the article 'The Efficacy of...' published in The Lancet.").

Respond ONLY with the structured JSON output.
`,
});


const referenceGeneratorFlow = ai.defineFlow(
  {
    name: 'referenceGeneratorFlow',
    inputSchema: ReferenceGeneratorInputSchema,
    outputSchema: ReferenceGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
