
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

const WritingSuggestionSchema = z.object({
    original_text: z.string().describe("The original sentence or phrase from the document."),
    suggestion: z.string().describe("The suggested improvement."),
    explanation: z.string().describe("A brief explanation for the suggestion (e.g., 'Improves clarity', 'More concise', 'Corrects grammar')."),
    type: z.enum(['Clarity', 'Conciseness', 'Grammar', 'Tone', 'Vocabulary']).describe("The category of the suggestion."),
});

const PlagiarismResultSchema = z.object({
  overall_similarity_percentage: z.coerce.number().min(0).max(100).describe("The overall percentage of the text that is similar to existing sources."),
  segments: z.array(PlagiarizedSegmentSchema).describe("A list of segments identified as potentially plagiarized."),
  summary: z.string().describe("A brief summary of the findings and a recommendation on whether the document needs revisions for originality."),
  writing_suggestions: z.array(WritingSuggestionSchema).describe("A list of grammar, style, and clarity improvements."),
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
  prompt: `You are an academic integrity AI tool and writing assistant. Your task is to analyze a given document for plagiarism against a simulated database of sources and to provide constructive writing feedback.

**Source Pools to Check Against:**
1.  **Open Web:** Publicly indexed websites, blogs, news articles.
2.  **Academic Databases:** Simulate checking against sources like PubMed, CrossRef, and major scientific journals.
3.  **Institutional Repository:** Simulate checking against a database of previously submitted student papers and theses.

**Input Document:**
{{media url=documentDataUri}}

**Part 1: Plagiarism Check**

1.  **Analyze & OCR:** Read the document and extract all text.
2.  **Citation Awareness:** You MUST differentiate between unoriginal text and properly cited text. If a passage is a direct match but is enclosed in quotation marks ("...") and has a clear in-text citation (e.g., Smith, 2021), it should NOT be flagged as plagiarism.
3.  **Handle Edge Cases:**
    *   **Common Phrases & Jargon:** Do NOT flag common technical phrases or domain-specific jargon (e.g., "pharmacokinetic parameters include clearance...", "The patient was diagnosed with...").
    *   **Methods/Recipes:** Treat standard procedural text (e.g., "The solution was heated to 100°C for 10 minutes.") with a lower penalty or recognize it as standard methodology.
4.  **Weighted Scoring:** You MUST calculate the 'overall_similarity_percentage' based on a weighted system:
    -   **High Weight:** Verbatim (copy-paste) matches.
    -   **Moderate Weight:** Paraphrased or semantically similar matches.
    -   **Zero Weight:** Properly quoted and cited passages. Do not include these in the similarity score calculation.
5.  **Identify Segments:** For each segment of potential plagiarism (verbatim or paraphrased), identify the 'original_text' and a plausible 'source' (e.g., "Wikipedia article on 'Beta-blockers'", "Journal of Pharmacology, 2021"). Assign a 'similarity_score' from 0 to 1 for that specific segment.
6.  **Generate Remediation Suggestion:** For each flagged segment, you MUST provide a concise, actionable 'remediation_suggestion'. This should explain why it was flagged and offer a clear next step. For example: "This sentence is a verbatim match. To fix this, you should either put it in quotation marks and add a citation, or rephrase it entirely in your own words and then cite the source."
7.  **Summarize:** Provide a final 'summary' of your findings. If similarity is high (>25%), recommend significant revisions. If moderate (10-25%), recommend a review. If low (<10%), confirm originality.

**Part 2: Grammar & Clarity Assistant**

1.  **Analyze Writing:** Scan the entire document for common writing issues.
2.  **Generate Suggestions:** Identify 3-5 opportunities for improvement and create a list of 'writing_suggestions'. For each suggestion, provide:
    -   'original_text': The sentence to be improved.
    -   'suggestion': The improved version.
    -   'explanation': The reason for the change (e.g., "Improves clarity and conciseness.").
    -   'type': The category of the suggestion (Clarity, Conciseness, Grammar, Tone, Vocabulary).
3.  **Prioritize:** Focus on high-impact suggestions like sentence clarity, passive voice, and academic tone.

Respond ONLY with the structured JSON output defined by the schema.
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
