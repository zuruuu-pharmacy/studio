'use server';
/**
 * @fileOverview AI-powered plagiarism checker.
 *
 * - checkPlagiarism - A function that analyzes text for plagiarism.
 * - PlagiarismInput - The input type for the checkPlagiarism function.
 * - PlagiarismResult - The return type for the checkPlagiarism function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlagiarismInputSchema = z.object({
  text: z.string().min(50, "Text must be at least 50 characters long.").describe("The text content to check for plagiarism."),
});
export type PlagiarismInput = z.infer<typeof PlagiarismInputSchema>;

const PlagiarizedSegmentSchema = z.object({
  original_text: z.string().describe("The segment of text from the user's input that is potentially plagiarized."),
  source: z.string().describe("The likely source of the plagiarized text (e.g., 'Wikipedia', 'Journal of Pharmacology, 2021')."),
  similarity_score: z.coerce.number().min(0).max(1).describe("The similarity score between the user's text and the source, from 0 to 1."),
});

const PlagiarismResultSchema = z.object({
  overall_similarity_percentage: z.coerce.number().min(0).max(100).describe("The overall percentage of the text that is similar to existing sources."),
  segments: z.array(PlagiarizedSegmentSchema).describe("A list of segments identified as potentially plagiarized."),
  summary: z.string().describe("A brief summary of the findings and a recommendation on whether the document needs revisions for originality."),
});
export type PlagiarismResult = z.infer<typeof PlagiarismResultSchema>;


export async function checkPlagiarism(input: PlagiarismInput): Promise<PlagiarismResult> {
  return plagiarismCheckerFlow(input);
}


const prompt = ai.definePrompt({
  name: 'plagiarismCheckerPrompt',
  input: {schema: PlagiarismInputSchema},
  output: {schema: PlagiarismResultSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an academic integrity AI tool. Your task is to analyze a given text for plagiarism against a simulated database of academic journals, websites, and textbooks.

**Input Text:**
\`\`\`
{{{text}}}
\`\`\`

**Instructions:**
1.  **Analyze the Text:** Read the text and identify any segments that are highly similar to well-known external sources.
2.  **Calculate Similarity:** For each identified segment, provide a 'similarity_score' between 0 and 1.
3.  **Identify Sources:** For each segment, identify a plausible 'source'. Be specific where possible (e.g., "Wikipedia article on 'Beta-blockers'", "Goodman & Gilman's Pharmacological Basis of Therapeutics, 13th Ed.").
4.  **Overall Score:** Calculate an 'overall_similarity_percentage' for the entire document. This should be a weighted average based on the length and severity of the matches.
5.  **Summarize:** Provide a concise 'summary' of your findings. If similarity is high (>25%), recommend significant revisions. If it is moderate (10-25%), recommend a review. If it is low (<10%), confirm originality.

Respond ONLY in the structured JSON format defined by the schema.
`,
});


const plagiarismCheckerFlow = ai.defineFlow(
  {
    name: 'plagiarismCheckerFlow',
    inputSchema: PlagiarismInputSchema,
    outputSchema: PlagiarismResultSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
