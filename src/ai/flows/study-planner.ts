
'use server';
/**
 * @fileOverview AI-powered study planner for students.
 *
 * - generateStudyPlan - Creates a weekly study timetable based on student inputs.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyPlannerInputSchema = z.object({
  subjects: z.array(z.string()).min(1, "At least one subject is required.").describe("List of subjects or topics to study."),
  studyDuration: z.string().min(3, "Please specify the study duration.").describe("The total duration for the study plan (e.g., '4 weeks until final exams', 'the next 2 weeks')."),
  hoursPerDay: z.coerce.number().min(1, "Please specify daily study hours.").max(12, "Daily study hours cannot exceed 12.").describe("The average number of hours available for study each day."),
  learningObjective: z.string().optional().describe("The primary learning objective (e.g., 'deep understanding', 'quick revision', 'pass the exam')."),
});
export type StudyPlannerInput = z.infer<typeof StudyPlannerInputSchema>;


const TimeSlotSchema = z.object({
    time: z.string().describe("The time for the study block (e.g., '9:00 AM - 11:00 AM')."),
    subject: z.string().describe("The subject to be studied during this block."),
    activity: z.string().describe("The suggested activity (e.g., 'Read Chapter 5', 'Practice MCQs', 'Active Recall Session', 'Watch Lecture')."),
    isBreak: z.boolean().default(false).describe("Whether this slot is a break."),
});

const DailyPlanSchema = z.object({
    day: z.string().describe("The day of the week (e.g., 'Monday')."),
    slots: z.array(TimeSlotSchema),
});

const StudyPlannerOutputSchema = z.object({
  weeklyPlan: z.array(DailyPlanSchema).describe("A 7-day study plan."),
  summaryNotes: z.string().describe("A summary of the study strategy and general tips for success."),
});
export type StudyPlannerOutput = z.infer<typeof StudyPlannerOutputSchema>;

export async function generateStudyPlan(input: StudyPlannerInput): Promise<StudyPlannerOutput> {
  return studyPlannerFlow(input);
}


const prompt = ai.definePrompt({
  name: 'studyPlannerPrompt',
  input: {schema: StudyPlannerInputSchema},
  output: {schema: StudyPlannerOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert academic advisor and study strategist AI. Your task is to create a realistic, effective, and balanced weekly study plan for a student.

**Student's Input:**
-   **Subjects/Topics:** {{subjects}}
-   **Study Duration:** {{{studyDuration}}}
-   **Average Hours Per Day:** {{{hoursPerDay}}}
-   **Learning Objective:** {{{learningObjective}}}

**Your Instructions:**
1.  **Structure the Week:** Create a 7-day timetable from Monday to Sunday.
2.  **Allocate Time:** Based on the 'hoursPerDay', intelligently schedule study blocks for each day.
    -   Distribute subjects evenly throughout the week to avoid burnout and facilitate spaced repetition.
    -   Prioritize subjects that may be perceived as more difficult if possible.
3.  **Incorporate Breaks:** You MUST schedule short breaks (e.g., 15-30 minutes) between study sessions and a longer break for meals. Mark these slots with 'isBreak: true'.
4.  **Suggest Activities:** For each study block, suggest a specific, actionable 'activity'. Do not just list the subject. Examples:
    -   "Read Chapter 3 of Pharmacology"
    -   "Solve 20 practice problems for Pharmaceutics"
    -   "Create flashcards for key drug classifications"
    -   "Active recall session for Pharmacognosy topics"
    -   "Review last week's notes"
5.  **Generate Summary Notes:** Provide a brief summary of the overall strategy, encouraging the student and offering tips for effective studying, like the importance of consistency, sleep, and active learning techniques.

Respond ONLY with the structured JSON output as defined by the schema.
`,
});


const studyPlannerFlow = ai.defineFlow(
  {
    name: 'studyPlannerFlow',
    inputSchema: StudyPlannerInputSchema,
    outputSchema: StudyPlannerOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
