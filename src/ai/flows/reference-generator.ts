
'use server';
/**
 * @fileOverview AI-powered reference and citation generator.
 *
 * - generateReference - A function that creates a formatted citation for a given text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReferenceGeneratorInputSchema = z.object({
  sourceIdentifier: z.string().min(10, "Please provide a valid reference string, DOI, PMID, URL, or a list of references to format.").describe("A full or partial reference string, DOI, PMID, URL, or an entire bibliography to be formatted."),
  style: z.enum(['Vancouver', 'APA', 'Harvard', 'MLA']).describe("The desired citation style."),
});
export type ReferenceGeneratorInput = z.infer<typeof ReferenceGeneratorInputSchema>;

const ReferenceGeneratorOutputSchema = z.object({
  formattedCitation: z.string().describe("The fully formatted citation in the requested style. If multiple references were provided, this should be the full, formatted bibliography."),
  explanation: z.string().describe("A brief explanation of the reference(s) that were formatted."),
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
  prompt: `You are an expert academic librarian and citation specialist. Your task is to find the full citation details for a given source identifier (or a list of them) and format it correctly in the specified citation style.

The user's input might be a clean DOI/PMID/URL, a single messy citation, or an entire bibliography of messy references pasted in.

**Source Identifier(s) (DOI, PMID, URL, or messy text):**
"{{{sourceIdentifier}}}"

**Citation Style:**
{{{style}}}

**Instructions:**
1.  **Analyze the Source(s):** Intelligently analyze the "sourceIdentifier" text. Determine if it's a single entry or a list of references.
2.  **Find Full Details:** For each potential reference found, retrieve all necessary citation details (authors, title, journal, year, volume, pages, etc.). You must find the definitive source for each.
3.  **Format Citation(s):** Format the full reference(s) perfectly according to the rules of the selected '{{{style}}}' style. If the input was a list, return a single string containing the full, correctly formatted bibliography with each reference on a new line.
4.  **Explain Your Work:** In the 'explanation' field, briefly confirm the source(s) you found (e.g., "This citation is for the article 'The Efficacy of...' published in The Lancet." or "I have formatted the 5 references you provided.").

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
