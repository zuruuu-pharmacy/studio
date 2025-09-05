
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
  documentDataUri: z.string().describe("The document to check for plagiarism, as a data URI."),
});
export type PlagiarismInput = z.infer<typeof PlagiarismInputSchema>;

const PlagiarizedSegmentSchema = z.object({
  original_text: z.string().describe("The segment of text from the user's input that is potentially plagiarized."),
  source: z.string().describe("The likely source of the plagiarized text (e.g., 'Wikipedia', 'Journal of Pharmacology, 2021', 'Student submission from course PH-101')."),
  similarity_score: z.coerce.number().min(0).max(1).describe("The similarity score between the user's text and the source, from 0 to 1."),
  remediation_suggestion: z.string().optional().describe("An actionable suggestion for the student to fix the issue, e.g., rephrase, cite, or quote."),
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
  prompt: `You are an academic integrity AI tool. Your task is to analyze a given document for plagiarism against a simulated database of sources.

**Source Pools to Check Against:**
1.  **Open Web:** Publicly indexed websites, blogs, news articles.
2.  **Academic Databases:** Simulate checking against sources like PubMed, CrossRef, and major scientific journals.
3.  **Institutional Repository:** Simulate checking against a database of previously submitted student papers and theses.

**Input Document:**
{{media url=documentDataUri}}

**Instructions:**
1.  **Analyze the Document:** Perform OCR if necessary. Read the document and identify any segments that are highly similar to the simulated external sources.
2.  **CRITICAL: Citation Awareness:** You MUST differentiate between unoriginal text and properly cited text. If a passage is a direct match but is enclosed in quotation marks ("...") and has a clear in-text citation (e.g., Smith, 2021), it should NOT be included in the 'segments' list and should not contribute heavily to the overall similarity score. Your summary can note that correctly quoted sections were found. Focus your flagging on text that is copied without attribution.
3.  **Calculate Similarity:** For each identified segment of potential plagiarism, provide a 'similarity_score' between 0 and 1.
4.  **Identify Sources:** For each segment, identify a plausible 'source' from one of the source pools. Be specific (e.g., "Wikipedia article on 'Beta-blockers'", "Journal of Pharmacology, 2021", "Student submission from PH-402, Fall 2023").
5.  **Generate Remediation Suggestion:** For each flagged segment, provide a concise, actionable 'remediation_suggestion' for the student. For example: "This sentence is a verbatim match. Consider placing it in quotation marks and adding a citation, or rephrasing it in your own words." or "This idea is very similar to the source. Ensure you have cited the source correctly."
6.  **Overall Score:** Calculate an 'overall_similarity_percentage' for the entire document. This should be a weighted average based on the length and severity of the matches, excluding properly cited material.
7.  **Summarize:** Provide a concise 'summary' of your findings. If similarity is high (>25%), recommend significant revisions. If it is moderate (10-25%), recommend a review. If it is low (<10%), confirm originality.

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
