
'use server';
/**
 * @fileOverview AI-powered diet and nutrition planner.
 *
 * - generateDietPlan - Generates a 1-day diet plan based on patient history and preferences.
 * - DietPlannerInput - The input type for the generateDietPlan function.
 * - DietPlannerOutput - The return type for the generateDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { PatientHistory } from '@/contexts/patient-context';

const DietPlannerInputSchema = z.object({
  conditions: z.string().describe("The patient's primary health conditions (e.g., 'Diabetes, Hypertension')."),
  allergies: z.string().describe("A list of the patient's known food allergies (e.g., 'Peanuts, Shellfish')."),
  preferences: z.string().describe("The patient's food preferences, including likes, dislikes, and spice level (e.g., 'Loves chicken, dislikes fish, prefers spicy food')."),
  goal: z.string().describe("The primary health goal for this diet plan (e.g., 'Weight loss', 'Blood sugar control')."),
  detailedHistory: z.any().optional().describe("The patient's full, detailed history for deeper context."),
});
export type DietPlannerInput = z.infer<typeof DietPlannerInputSchema>;

const DietPlannerOutputSchema = z.object({
  diet_plan: z.object({
    breakfast: z.string().describe('A descriptive breakfast suggestion, including preparation tips.'),
    lunch: z.string().describe('A descriptive lunch suggestion, including preparation tips.'),
    snack: z.string().describe('A descriptive afternoon snack suggestion.'),
    dinner: z.string().describe('A descriptive dinner suggestion, including preparation tips.'),
  }),
  shopping_list: z.array(z.string()).describe('A concise shopping list of key items needed for the day\'s meals.'),
  clinical_notes: z.string().describe('Detailed clinical notes explaining WHY these food choices were made, referencing the patient\'s conditions, goals, and preferences.'),
  foods_to_favor: z.string().describe('A list of general foods and food groups the patient should favor.'),
  foods_to_avoid: z.string().describe('A list of general foods and food groups the patient should limit or avoid.'),
  disclaimer: z.string().default('This diet plan is AI-generated and not a substitute for professional medical advice. Consult a doctor or registered dietitian before making significant dietary changes.'),
});
export type DietPlannerOutput = z.infer<typeof DietPlannerOutputSchema>;

export async function generateDietPlan(input: DietPlannerInput): Promise<DietPlannerOutput> {
  return dietPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dietPlannerPrompt',
  input: {schema: DietPlannerInputSchema},
  output: {schema: DietPlannerOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert clinical nutritionist and dietitian AI. Your task is to create a highly personalized, descriptive, and actionable 1-day diet plan for a patient.

**Patient Profile:**
-   **Primary Health Conditions:** {{{conditions}}}
-   **Known Food Allergies:** {{{allergies}}}
-   **Dietary Goal:** {{{goal}}}
-   **Food Preferences & Dislikes:** {{{preferences}}}

**Full Patient History (for additional context):**
- Past Medical History: {{{detailedHistory.pastMedicalHistory}}}
- Medication History: {{{detailedHistory.medicationHistory}}}
- Social History: {{{detailedHistory.socialHistory}}}
- Review of Systems & Notes: {{{detailedHistory.reviewOfSystems}}} {{{detailedHistory.systemicNotes}}}


**Your Task:**

1.  **Create a 1-Day Meal Plan:**
    *   Design a realistic and appealing meal plan for breakfast, lunch, dinner, and one snack.
    *   For each meal, be descriptive. Instead of "Oatmeal," write "A warm bowl of oatmeal made with milk, topped with a handful of berries and a sprinkle of cinnamon for flavor."
    *   Provide simple preparation tips where relevant.

2.  **Generate a Shopping List:** Create a simple list of key ingredients needed for the day's meals.

3.  **Provide Detailed Clinical Notes:** This is the most important part. Explain the clinical reasoning behind your choices.
    *   Directly connect your recommendations to the patient's conditions (e.g., "The oatmeal provides soluble fiber to help manage blood sugar levels, which is crucial for diabetes...").
    *   Justify why certain foods are included or excluded based on their health goal and allergies.
    *   Explain how the meal plan aligns with general dietary guidelines for their conditions (e.g., DASH diet for hypertension).

4.  **List Foods to Favor and Avoid:** Provide general guidance on food groups to help the patient make good choices on other days.

5.  **Include the Standard Disclaimer.**

Respond in the structured JSON format defined by the output schema.
`,
});

const dietPlannerFlow = ai.defineFlow(
  {
    name: 'dietPlannerFlow',
    inputSchema: DietPlannerInputSchema,
    outputSchema: DietPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
