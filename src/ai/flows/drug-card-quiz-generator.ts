
'use server';
/**
 * @fileOverview AI-powered generator for a single MCQ from a drug card.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizGeneratorInputSchema = z.object({
  drugName: z.string(),
  classification: z.string(),
  uses: z.string(),
  adrs: z.string(),
});
export type QuizGeneratorInput = z.infer<typeof QuizGeneratorInputSchema>;

const QuizGeneratorOutputSchema = z.object({
    question: z.string().describe("A multiple-choice question about the drug's uses or ADRs."),
    options: z.array(z.string()).length(4).describe("An array of 4 plausible options."),
    correct_answer: z.string().describe("The letter and text of the correct answer (e.g., 'B. Hypertension')."),
    explanation: z.string().describe("A detailed explanation of why the correct answer is right and the others are wrong."),
});
export type QuizGeneratorOutput = z.infer<typeof QuizGeneratorOutputSchema>;

export async function generateQuiz(input: QuizGeneratorInput): Promise<QuizGeneratorOutput> {
  return quizGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'drugQuizGeneratorPrompt',
  input: {schema: QuizGeneratorInputSchema},
  output: {schema: QuizGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert pharmacology question writer for medical exams.
Your task is to create a single, high-quality multiple-choice question (MCQ) based on the provided drug information. The question should focus on either a primary clinical use or a major adverse effect.

**Drug Information:**
-   **Drug Name:** {{{drugName}}}
-   **Classification:** {{{classification}}}
-   **Clinical Uses:** {{{uses}}}
-   **Adverse Drug Reactions (ADRs):** {{{adrs}}}

**Instructions:**
1.  **Formulate a Question:** Ask a clear question. Example: "Which of the following is a primary indication for {{{drugName}}}?" or "A common adverse effect associated with {{{drugName}}} is:".
2.  **Generate Options:** Provide 4 plausible options. One must be correct, and the others should be common but incorrect distractors.
3.  **Identify Correct Answer:** State the correct answer clearly.
4.  **Provide Rationale:** Write a brief explanation for why the correct answer is right.

Respond ONLY with the structured JSON output.
`,
});

const quizGeneratorFlow = ai.defineFlow(
  {
    name: 'quizGeneratorFlow',
    inputSchema: QuizGeneratorInputSchema,
    outputSchema: QuizGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
