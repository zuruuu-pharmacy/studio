
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
  studyPreferences: z.string().optional().describe("A description of study preferences (e.g., 'I study best in the morning', 'I prefer 50-minute blocks with 10-minute breaks', 'I like to use the Pomodoro technique')."),
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
  prompt: `You are an expert academic advisor and learning strategist AI. Your task is to create a realistic, effective, and balanced weekly study plan for a student, acting as their personal coach.

**Student's Input:**
-   **Subjects/Topics:** {{subjects}}
-   **Study Duration:** {{{studyDuration}}}
-   **Average Hours Per Day:** {{{hoursPerDay}}}
-   **Learning Objective:** {{{learningObjective}}}
-   **Personal Constraints (Fixed Times):** {{{personalConstraints}}}
-   **Study Preferences:** {{{studyPreferences}}}


**Your Instructions as a Learning Strategist:**

1.  **Structure the Week:** Create a 7-day timetable from Monday to Sunday.

2.  **Allocate Time Intelligently:** Based on the 'hoursPerDay' and constraints, schedule study blocks for each day.
    -   **Respect Constraints:** You MUST block out time for personal constraints like sleep, work, or prayer times mentioned.
    -   **Distribute Subjects:** Spread subjects throughout the week to avoid burnout and leverage spaced repetition. Don't cram one subject into a single day.
    -   **Prioritization:** If preferences are mentioned (e.g., "freshest in the morning"), place more cognitively demanding subjects during those times.
    -   **Weekend Balance:** Make the weekend schedule slightly lighter if possible, to allow for rest and consolidation of the week's learning.

3.  **Incorporate Essential Breaks:** You MUST schedule short breaks (e.g., 15-30 minutes, using activities like 'Short walk', 'Stretch break', 'Mindfulness break') between study sessions and a longer break for lunch/dinner. Mark these slots with 'isBreak: true'. A good pattern is 1-2 hours of study followed by a break. If the user mentions a preference like Pomodoro, incorporate that pattern.

4.  **Suggest Varied, Actionable Activities:** For each study block, suggest a specific and effective learning 'activity'. Go beyond simple "reading". Use a mix of techniques to promote deeper learning. Examples:
    -   "Read Chapter 3 on Beta-blockers, focusing on the mechanism of action."
    -   "Solve 20 practice problems for Pharmaceutics from the textbook."
    -   "Active Recall Session: Write down everything you remember about Pharmacognosy topics from a blank sheet of paper."
    -   "Pomodoro Block (25 min study / 5 min break) on drug interactions."
    -   "Watch the online lecture on pharmacokinetics and take notes."

5.  **Generate Summary & Strategy Notes:** Provide a brief, encouraging summary of the overall strategy. Offer actionable tips for effective studying, like the importance of consistency, quality sleep, staying hydrated, and using active learning techniques. Explain *why* the plan is structured the way it is (e.g., "I've included breaks to help you stay focused and varied the activities to keep you engaged, respecting your preference for morning study.").

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
