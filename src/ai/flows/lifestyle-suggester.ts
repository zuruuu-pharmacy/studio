
'use server';
/**
 * @fileOverview AI-powered lifestyle and preventive care suggestion generator.
 *
 * - getLifestyleSuggestions - A function that generates daily suggestions based on patient data.
 * - LifestyleSuggesterInput - The input type for the function.
 * - LifestyleSuggesterOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const demographicsSchema = z.object({
  name: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
  cnicOrPassport: z.string().optional(),
  address: z.string().optional(),
  hospitalId: z.string().optional(),
  phoneNumber: z.string().optional(),
}).optional();

const detailedHistorySchema = z.object({
  demographics: demographicsSchema,
  presentingComplaint: z.string().optional(),
  historyOfPresentingIllness: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  medicationHistory: z.string().optional(),
  allergyHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  socialHistory: z.string().optional(),
  immunizationHistory: z.string().optional(),
  reviewOfSystems: z.string().optional(),
  lifestyleAndCompliance: z.string().optional(),
  ideasAndConcerns: z.string().optional(),
  pharmacistAssessment: z.string().optional(),
  carePlan: z.string().optional(),
}).optional();

const LifestyleSuggesterInputSchema = z.object({
  detailedHistory: detailedHistorySchema.describe('Detailed patient history for a comprehensive workup.'),
});
export type LifestyleSuggesterInput = z.infer<typeof LifestyleSuggesterInputSchema>;

const LifestyleSuggesterOutputSchema = z.object({
  suggestions: z.array(z.object({
    category: z.string().describe('The category of the suggestion (e.g., "Diet", "Exercise", "Monitoring").'),
    message: z.string().describe('The actionable suggestion, prefixed with a priority emoji (🟢, 🟡, or 🔴).'),
    priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the suggestion.'),
  })),
});
export type LifestyleSuggesterOutput = z.infer<typeof LifestyleSuggesterOutputSchema>;


export async function getLifestyleSuggestions(input: LifestyleSuggesterInput): Promise<LifestyleSuggesterOutput> {
  return lifestyleSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lifestyleSuggesterPrompt',
  input: {schema: LifestyleSuggesterInputSchema},
  output: {schema: LifestyleSuggesterOutputSchema},
  prompt: `You are an AI health assistant integrated into a patient dashboard. Your role is to analyze a patient’s profile and generate simple, daily lifestyle and preventive care suggestions. Always keep advice safe, evidence-based, and practical for everyday life.

Analyze the following patient data:
- **Age**: {{detailedHistory.demographics.age}}
- **Gender**: {{detailedHistory.demographics.gender}}
- **Past Medical History (Chronic Diseases)**: {{detailedHistory.pastMedicalHistory}}
- **Medication History**: {{detailedHistory.medicationHistory}}
- **Social History (Lifestyle Info)**: {{detailedHistory.socialHistory}}
- **Lifestyle & Compliance**: {{detailedHistory.lifestyleAndCompliance}}


**Your Task:**
Generate 4-5 personalized, bite-sized suggestions based on the data.

**Personalization Logic:**
- **Age-based:**
  - 20s-30s: Focus on fitness, sleep, and mental wellness.
  - 40s-50s: Focus on preventive screenings, weight management, and stress reduction.
  - 60+: Focus on mobility, fall prevention, and chronic disease management.
- **Condition-based:**
  - Diabetes: Suggest blood sugar checks, carb-conscious diet tips, and foot care.
  - Hypertension: Suggest low-salt meals, blood pressure monitoring, and relaxation techniques.
  - Obesity/Overweight: Suggest portion control, low-calorie swaps, and micro-exercise.
- **Lifestyle-based:**
  - Smoker: Provide gentle quitting tips or reduction strategies.
  - Sedentary: Suggest small, achievable movement goals (e.g., "Take a 10-min walk").

**Delivery Format:**
- **Tone:** Friendly, encouraging, and actionable.
- **Categories:** "Dietary Habits", "Exercise & Movement", "Preventive Monitoring", "Mental Wellness", or a specific "Disease-specific Care" (e.g., "Diabetes Care").
- **Priority:** Assign a priority ("High", "Medium", "Low").
- **Message Formatting:** You MUST start each message with an emoji based on the priority:
  - 🔴 for High priority (e.g., critical monitoring).
  - 🟡 for Medium priority (e.g., important daily habit).
  - 🟢 for Low priority (e.g., general wellness tip).

**Example Output:**
For a 52-year-old male with Diabetes & Hypertension, who is sedentary:
{
  "suggestions": [
    { "category": "Preventive Monitoring", "message": "🔴 Check your blood sugar at 8 AM before breakfast.", "priority": "High" },
    { "category": "Hypertension Care", "message": "🟡 Keep salt low in tonight’s meal and log your BP reading.", "priority": "Medium" },
    { "category": "Dietary Habits", "message": "🟢 Swap fried snacks with fruit for evening hunger.", "priority": "Low" },
    { "category": "Exercise & Movement", "message": "🟢 Take a 10-minute evening walk after dinner.", "priority": "Low" }
  ]
}

Now, generate the suggestions for the provided patient.
`,
});


const lifestyleSuggesterFlow = ai.defineFlow(
  {
    name: 'lifestyleSuggesterFlow',
    inputSchema: LifestyleSuggesterInputSchema,
    outputSchema: LifestyleSuggesterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
