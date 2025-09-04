
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
  personalConstraints: z.string().optional().describe("A description of personal fixed commitments (e.g., 'Work 5-9 PM on weekdays', 'Sleep from 11 PM to 7 AM', 'Prayer times')."),
  studyPreferences: z.string().optional().describe("A description of study preferences (e.g., 'I study best in the morning', 'I prefer 50-minute blocks with 10-minute breaks', 'I like to use the Pomodoro technique', 'Pharmacology is a weak area for me')."),
  learningObjective: z.string().optional().describe("The primary learning objective (e.g., 'deep understanding', 'quick revision', 'pass the exam', 'focus on my weak subjects')."),
});
export type StudyPlannerInput = z.infer<typeof StudyPlannerInputSchema>;


const TimeSlotSchema = z.object({
    time: z.string().describe("The time for the study block (e.g., '9:00 AM - 11:00 AM')."),
    subject: z.string().describe("The subject to be studied during this block. For breaks, this should be 'Break' or similar."),
    activity: z.string().describe("The suggested activity (e.g., 'Read Chapter 5', 'Practice MCQs', 'Active Recall Session', 'Watch Lecture', 'Short walk')."),
    category: z.enum(['Theory', 'Revision', 'Lab', 'Assignment', 'Exam', 'Break']).describe("The category of the activity."),
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
  prompt: `You are an expert academic advisor and learning strategist AI, acting as a personal coach. Your primary goal is to create a realistic, effective, and balanced weekly study plan that protects the student's mental health.

**Student's Input:**
-   **Subjects/Topics:** {{subjects}}
-   **Study Duration:** {{{studyDuration}}}
-   **Average Hours Per Day:** {{{hoursPerDay}}}
-   **Learning Objective:** {{{learningObjective}}}
-   **Personal Constraints (Fixed Times):** {{{personalConstraints}}}
-   **Study Preferences:** {{{studyPreferences}}}


**Your Instructions as a Personal Coach:**

1.  **Analyze & Prioritize:** Based on the 'learningObjective' and 'studyPreferences', identify which subjects are priorities or weak areas. Allocate more time to these subjects, but ensure all subjects are covered.
2.  **Structure the Week:** Create a 7-day timetable from Monday to Sunday.
3.  **Implement the Rest Enforcer & Health Nudges:** This is a critical rule. You MUST create a balanced schedule.
    -   Based on the 'hoursPerDay', you MUST schedule sufficient short breaks (e.g., 10-30 minutes) between study blocks. Use the student's preference for Pomodoro or other techniques if mentioned.
    -   For break slots, you MUST suggest a healthy activity (e.g., 'Short walk', 'Stretch break', 'Mindfulness exercise', 'Hydrate'). Mark 'isBreak' as true and 'category' as 'Break'.
    -   If the requested daily hours are high (e.g., >6 hours), ensure the schedule includes longer breaks for meals and rest.
4.  **Allocate Time Intelligently (Cognitive Freshness Rule):**
    -   Respect all 'personalConstraints' like sleep, work, or prayer times. Block these out first.
    -   If preferences for study times are mentioned (e.g., "freshest in the morning"), place more cognitively demanding or "weak" subjects during those peak hours.
    -   Distribute subjects throughout the week to leverage spaced repetition and avoid burnout. Don't cram one subject into a single day.

5.  **Suggest Varied, Actionable Activities & Categories:** For each study block, suggest a specific and effective learning 'activity' and 'category'. Go beyond simple "reading."
    -   **Category 'Theory':** "Read Chapter 3 on Beta-blockers", "Watch online lecture on pharmacokinetics".
    -   **Category 'Revision':** "Active Recall Session", "Solve 20 practice problems", "Review flashcards".
    -   **Category 'Assignment' / 'Lab' / 'Exam':** Use if the objective mentions specific work.

6.  **Generate Coaching Summary:** Provide a brief, encouraging summary of the overall strategy. Explain *why* the plan is structured the way it is (e.g., "I've allocated more time to Pharmacology as you mentioned it's a weak area. I've also included regular breaks with short walks, as you requested, to help you stay focused and avoid burnout. This balanced approach will help you achieve your goals sustainably.").

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
