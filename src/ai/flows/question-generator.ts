
'use server';
/**
 * @fileOverview AI-powered question generator for a given topic.
 *
 * - generateQuestions - Creates a list of questions based on a topic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
    question: z.string().describe("The generated question."),
    hint: z.string().describe("A subtle hint for the student."),
});

const QuestionGeneratorInputSchema = z.object({
  topic: z.string().describe("The topic for the questions (e.g., 'Hypertension', 'Anticoagulants')."),
  count: z.coerce.number().optional().default(10).describe("The desired number of questions."),
});
export type QuestionGeneratorInput = z.infer<typeof QuestionGeneratorInputSchema>;

const QuestionGeneratorOutputSchema = z.object({
    questions: z.array(QuestionSchema),
    topic: z.string(),
});
export type QuestionGeneratorOutput = z.infer<typeof QuestionGeneratorOutputSchema>;


export async function generateQuestions(input: QuestionGeneratorInput): Promise<QuestionGeneratorOutput> {
  return questionGeneratorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'questionGeneratorPrompt',
  input: {schema: QuestionGeneratorInputSchema},
  output: {schema: QuestionGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert Pharmacy Professor AI. Your task is to generate a list of high-quality, thought-provoking questions for a student based on a specific topic.

**Topic:** {{{topic}}}
**Number of Questions:** {{{count}}}

**Instructions:**
1.  **Generate Questions:** Create a list of exactly {{{count}}} questions that cover different aspects of the topic (e.g., mechanism, side effects, counseling points, clinical application).
2.  **Generate Hints:** For each question, provide a subtle hint that guides the student toward the correct answer without giving it away.
3.  **Topic Echo:** Return the original topic in the output.

Respond ONLY with the structured JSON output.
`,
});


const questionGeneratorFlow = ai.defineFlow(
  {
    name: 'questionGeneratorFlow',
    inputSchema: QuestionGeneratorInputSchema,
    outputSchema: QuestionGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
