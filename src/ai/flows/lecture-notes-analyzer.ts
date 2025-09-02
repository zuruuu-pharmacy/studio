
'use server';
/**
 * @fileOverview AI-powered academic assistant for a Lecture Notes Library.
 *
 * This flow analyzes uploaded lecture notes (text or images) and enhances them
 * with AI-generated summaries, organizational tags, and visual aids.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const LectureNotesAnalyzerInputSchema = z.object({
  topicName: z.string().describe('The primary topic or title of the lecture notes provided by the student.'),
  noteDataUri: z.string().describe("The lecture note file (e.g., image of handwritten notes, PDF, DOCX), as a data URI that must include a MIME type and use Base64 encoding."),
});
export type LectureNotesAnalyzerInput = z.infer<typeof LectureNotesAnalyzerInputSchema>;

export const LectureNotesAnalyzerOutputSchema = z.object({
  subject: z.string().describe('The academic subject (e.g., "Pharmacology", "Pharmaceutics").'),
  topic: z.string().describe('The specific topic of the notes, refined by the AI.'),
  semester: z.string().describe('The suggested academic semester or year (e.g., "3rd Year B.Pharm").'),
  difficulty: z.enum(['Easy', 'Moderate', 'Complex']).describe('The complexity level of the content.'),
  ai_summary: z.array(z.string()).describe('A list of 4-5 concise, exam-ready bullet points summarizing the key information.'),
  ai_flowchart: z.string().describe('A simple, text-based flowchart representing a key process from the notes (e.g., "Drug A -> Binds to Receptor X -> Blocks Pathway Y -> Effect Z").'),
  concept_map: z.object({
    mainTopic: z.string().describe('The central concept of the notes.'),
    relatedTopics: z.array(z.string()).describe('A list of 4-5 key related concepts or sub-topics.'),
  }).describe('A map of the main concept and its most important related topics.'),
});
export type LectureNotesAnalyzerOutput = z.infer<typeof LectureNotesAnalyzerOutputSchema>;

export async function analyzeLectureNotes(input: LectureNotesAnalyzerInput): Promise<LectureNotesAnalyzerOutput> {
  return lectureNotesAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lectureNotesAnalyzerPrompt',
  input: {schema: LectureNotesAnalyzerInputSchema},
  output: {schema: LectureNotesAnalyzerOutputSchema},
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are an AI academic assistant for pharmacy students. Your task is to analyze uploaded lecture notes and enhance them for studying.

**Student-provided Topic:** {{{topicName}}}

**Analysis Instructions:**

1.  **Analyze Content:** Read the provided lecture notes carefully.
    {{media url=noteDataUri}}

2.  **Categorize:**
    *   **Subject:** Identify the most appropriate pharmacy subject (e.g., Pharmacology, Pharmaceutics, Clinical Pharmacy).
    *   **Topic:** Refine the student's provided topic name based on the content.
    *   **Semester:** Suggest the most likely semester or year of study this topic belongs to.
    *   **Difficulty:** Classify the content's difficulty as Easy, Moderate, or Complex.

3.  **Enhance:**
    *   **Summary:** Generate a list of 4-5 key, exam-ready bullet points.
    *   **Flowchart:** Create a simple, text-based flowchart of a core process described in the notes.
    *   **Concept Map:** Identify the main topic and list 4-5 of its most important related sub-topics or concepts.

Respond ONLY with the structured JSON output.
`,
});

const lectureNotesAnalyzerFlow = ai.defineFlow(
  {
    name: 'lectureNotesAnalyzerFlow',
    inputSchema: LectureNotesAnalyzerInputSchema,
    outputSchema: LectureNotesAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }
    // Remap the concept map from the prompt to match the output schema
    // @ts-ignore
    if (output.concept_map) {
      // @ts-ignore
      const mainTopic = Object.keys(output.concept_map)[0];
      // @ts-ignore
      const relatedTopics = output.concept_map[mainTopic];
      return { ...output, concept_map: { mainTopic, relatedTopics } };
    }
    
    return output;
  }
);
