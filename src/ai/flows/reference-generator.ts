
'use server';
/**
 * @fileOverview AI-powered reference and citation generator.
 *
 * - generateReference - A function that creates a formatted citation for a given text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReferenceGeneratorInputSchema = z.object({
  sourceIdentifier: z.string().min(3, "Please provide a valid reference string, DOI, PMID, or URL.").describe("A full or partial reference string, DOI, PMID, or URL of the article to cite."),
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
  prompt: `You are an expert academic librarian and citation specialist. Your task is to find the full citation details for a given source identifier and format it correctly in the specified citation style.

The user's input might be a clean DOI/PMID/URL, or it might be a messy, incomplete, or unformatted reference string.

**Source Identifier (DOI, PMID, URL, or messy text):**
"{{{sourceIdentifier}}}"

**Citation Style:**
{{{style}}}

**Instructions:**
1.  **Analyze the Source:** Intelligently analyze the "sourceIdentifier".
    - First, check if it's a DOI, PMID, or URL.
    - If not, treat it as a search query or a messy citation. Extract key information like author, year, and title keywords.
2.  **Find Full Details:** Based on your analysis, retrieve all necessary citation details (authors, title, journal, year, volume, pages, etc.). You must find the definitive source.
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
