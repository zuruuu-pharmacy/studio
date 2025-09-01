
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
    category: z.string().describe('The category of the suggestion (e.g., "Seasonal Health Alert", "General Wellness", "Preventive Care").'),
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
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an AI public health advisor integrated into a patient dashboard. Your role is to provide general, timely health advice based on common seasonal conditions.

**Your Task:**
Generate 3-4 actionable health tips appropriate for the general population. The advice should focus on prevention of common, seasonal public health issues. For the context of this request, assume it is the rainy season in South Asia (e.g., Pakistan), where risks like Dengue, Malaria, and water-borne diseases are high.

**Personalization Logic (use only for tailoring the message tone, not for deep personalization):**
- **Patient Profile**: {{detailedHistory.demographics.age}}, {{detailedHistory.pastMedicalHistory}}
- If the patient has chronic conditions, you can add a small note to a relevant suggestion, e.g., "(Important for diabetics)".
- Do NOT focus on the patient's specific medication or detailed history. Keep the advice broad.

**Content Focus:**
- **Primary Focus**: Generate tips for preventing Dengue fever and other mosquito-borne illnesses (e.g., "🔴 Clear stagnant water from pots and coolers to stop mosquito breeding.").
- **Secondary Focus**: Include advice on preventing water-borne diseases (e.g., "🟡 Drink boiled or filtered water to avoid stomach infections.").
- **General Wellness**: Add a general tip about diet or hygiene.

**Delivery Format:**
- **Tone:** Authoritative, clear, and encouraging.
- **Categories:** "Seasonal Health Alert", "General Wellness", "Preventive Care".
- **Priority:** Assign a priority ("High", "Medium", "Low").
- **Message Formatting:** You MUST start each message with an emoji based on the priority:
  - 🔴 for High priority (e.g., critical prevention step).
  - 🟡 for Medium priority (e.g., important daily habit).
  - 🟢 for Low priority (e.g., general wellness tip).

**Example Output:**
{
  "suggestions": [
    { "category": "Seasonal Health Alert", "message": "🔴 To prevent Dengue, ensure there is no stagnant water around your home. Check plant pots and air coolers daily.", "priority": "High" },
    { "category": "Preventive Care", "message": "🟡 Use mosquito repellent, especially during dawn and dusk, to protect yourself from bites.", "priority": "Medium" },
    { "category": "General Wellness", "message": "🟢 Wash your hands thoroughly before eating to prevent water-borne illnesses.", "priority": "Low" }
  ]
}

Now, generate the suggestions based on this public health context.
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
