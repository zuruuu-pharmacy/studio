
'use server';
/**
 * @fileOverview AI-powered generator for a single, case-based MCQ from a drug card.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CaseMcqGeneratorInputSchema = z.object({
  drugName: z.string(),
  classification: z.string(),
  uses: z.string(),
  adrs: z.string(),
  contraindications: z.string(),
});
export type CaseMcqGeneratorInput = z.infer<typeof CaseMcqGeneratorInputSchema>;

const CaseMcqGeneratorOutputSchema = z.object({
    scenario: z.string().describe("A brief clinical scenario involving the drug."),
    question: z.string().describe("A multiple-choice question related to the scenario."),
    options: z.array(z.string()).length(4).describe("An array of 4 plausible options."),
    correct_answer: z.string().describe("The letter and text of the correct answer (e.g., 'B. Option text')."),
    explanation: z.string().describe("A detailed explanation of why the correct answer is right and the others are wrong."),
});
export type CaseMcqGeneratorOutput = z.infer<typeof CaseMcqGeneratorOutputSchema>;

export async function generateCaseMcq(input: CaseMcqGeneratorInput): Promise<CaseMcqGeneratorOutput> {
  return caseMcqGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'caseMcqGeneratorPrompt',
  input: {schema: CaseMcqGeneratorInputSchema},
  output: {schema: CaseMcqGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert pharmacology question writer for medical exams.
Your task is to create a single, high-quality, case-based multiple-choice question (MCQ) based on the provided drug information.

**Drug Information:**
-   **Drug Name:** {{{drugName}}}
-   **Classification:** {{{classification}}}
-   **Uses:** {{{uses}}}
-   **ADRs:** {{{adrs}}}
-   **Contraindications:** {{{contraindications}}}

**Instructions:**
1.  **Create a Scenario:** Write a short, realistic clinical scenario (1-2 sentences) where this drug might be used or cause an issue.
2.  **Formulate a Question:** Based on the scenario, ask a relevant clinical question. The question should test the student's understanding of the drug's use, a key side effect, or a major contraindication.
3.  **Generate Options:** Provide 4 plausible options. One must be correct, and the others should be common but incorrect distractors.
4.  **Identify Correct Answer:** State the correct answer clearly.
5.  **Provide Rationale:** Write a detailed explanation for why the correct answer is right and the other options are wrong.

Respond ONLY with the structured JSON output.
`,
});

const caseMcqGeneratorFlow = ai.defineFlow(
  {
    name: 'caseMcqGeneratorFlow',
    inputSchema: CaseMcqGeneratorInputSchema,
    outputSchema: CaseMcqGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
