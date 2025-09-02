
'use server';
/**
 * @fileOverview AI-powered study material generator.
 *
 * - generateStudyMaterial - Creates a comprehensive study guide on a given topic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyMaterialGeneratorInputSchema = z.object({
  topic: z.string().describe("The topic for which to generate study material (e.g., 'Beta-blockers')."),
});
export type StudyMaterialGeneratorInput = z.infer<typeof StudyMaterialGeneratorInputSchema>;

const MCQSchema = z.object({
    question: z.string().describe("A clear, exam-style multiple-choice question."),
    options: z.array(z.string()).describe("An array of 4 plausible answers."),
    correct_answer: z.string().describe("The letter and text of the correct answer (e.g., 'B. Atenolol')."),
    explanation: z.string().describe("A detailed explanation of why the correct answer is right and the others are wrong."),
    reference: z.string().optional().describe("A textbook or guideline reference."),
    tags: z.object({
        subject: z.string(),
        topic: z.string(),
        difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    }),
});

const StudyMaterialGeneratorOutputSchema = z.object({
    topic: z.string(),
    introduction: z.string().describe("A brief introduction to the topic."),
    key_concepts: z.array(z.object({
        concept: z.string().describe("The name of the key concept."),
        detail: z.string().describe("A detailed explanation of the concept, including examples."),
    })).describe("A list of fundamental concepts related to the topic."),
    case_study: z.object({
        title: z.string().describe("A title for the clinical case study."),
        scenario: z.string().describe("The patient's case/scenario."),
        discussion: z.string().describe("A discussion of the case, applying the topic's concepts."),
    }).describe("A relevant clinical case study."),
    quiz: z.array(MCQSchema).describe("A short quiz with multiple-choice questions to test understanding."),
    summary_points: z.array(z.string()).describe("A list of key takeaway points."),
});
export type StudyMaterialGeneratorOutput = z.infer<typeof StudyMaterialGeneratorOutputSchema>;

export async function generateStudyMaterial(input: StudyMaterialGeneratorInput): Promise<StudyMaterialGeneratorOutput> {
  return studyMaterialGeneratorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'studyMaterialGeneratorPrompt',
  input: {schema: StudyMaterialGeneratorInputSchema},
  output: {schema: StudyMaterialGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert Pharmacy Professor AI. Your task is to generate a complete, high-quality study guide for a student on the given topic.

**Topic:** {{{topic}}}

**Instructions:**
1.  **Introduction:** Start with a concise introduction that defines the topic and its importance in pharmacy.
2.  **Key Concepts:** Identify and explain 3-5 core concepts. For each concept, provide a detailed explanation with relevant examples (e.g., for a drug class, this would include MOA, therapeutic uses, key drugs, and side effects).
3.  **Clinical Case Study:** Create a realistic, short clinical case study that requires the student to apply the topic's knowledge. Include a brief discussion of the case.
4.  **Quiz (MCQs):** Generate exactly 30 high-quality, exam-style multiple-choice questions. For each MCQ, you MUST provide:
    -   A clear question (stem).
    -   An array of 4 plausible options.
    -   The correct answer (e.g., "B. Option text").
    -   A detailed explanation covering why the correct option is right and the incorrect options are wrong.
    -   Relevant tags (subject, topic, difficulty).
5.  **Summary Points:** Conclude with a bulleted list of the most critical key takeaways for quick revision.

The tone should be educational, clear, and professional. Structure the entire output in the specified JSON format.
`,
});


const studyMaterialGeneratorFlow = ai.defineFlow(
  {
    name: 'studyMaterialGeneratorFlow',
    inputSchema: StudyMaterialGeneratorInputSchema,
    outputSchema: StudyMaterialGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
