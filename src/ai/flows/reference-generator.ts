
'use server';
/**
 * @fileOverview AI-powered reference and citation generator.
 *
 * - generateReference - A function that creates a formatted citation for a given text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReferenceGeneratorInputSchema = z.object({
  textToCite: z.string().min(20, "Please provide at least 20 characters of text to cite.").describe("The block of text or statement that requires a citation."),
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
  prompt: `You are an expert academic librarian and citation specialist. Your task is to find the most appropriate scientific reference for a given piece of text and format it correctly in the specified citation style.

**Text to Cite:**
"{{{textToCite}}}"

**Citation Style:**
{{{style}}}

**Instructions:**
1.  **Identify Core Claim:** Analyze the "Text to Cite" to understand its core scientific claim or statement.
2.  **Find Best Reference:** Based on your knowledge, find the most accurate and authoritative reference for this claim. Prioritize primary research articles, major clinical guidelines, or reputable textbooks (like Goodman & Gilman's, BNF, etc.).
3.  **Format Citation:** Format the reference you found perfectly according to the rules of the selected '{{{style}}}' style.
4.  **Explain Your Choice:** In the 'explanation' field, briefly justify why you chose this specific reference. For example, explain if it's the seminal paper on the topic or a major clinical guideline.

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
