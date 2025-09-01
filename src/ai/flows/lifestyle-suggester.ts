
'use server';
/**
 * @fileOverview AI-powered lifestyle and preventive care suggester.
 *
 * - getLifestyleSuggestions - Generates daily health suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { PatientHistory } from '@/contexts/patient-context';


const SuggestionSchema = z.object({
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the suggestion (High: Red, Medium: Yellow, Low: Green).'),
  emoji: z.string().describe('An appropriate emoji for the suggestion (e.g., "🔴", "🟡", "🟢").'),
  title: z.string().describe('A short, catchy title for the suggestion.'),
  suggestion: z.string().describe('The detailed suggestion text.'),
});

const LifestyleSuggestionsInputSchema = z.object({
  detailedHistory: z.any().describe('The full patient history object.'),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format to provide seasonal context.'),
});

const LifestyleSuggestionsOutputSchema = z.object({
    suggestions: z.array(SuggestionSchema).describe('A list of 2-3 personalized lifestyle suggestions.'),
});

export async function getLifestyleSuggestions(history: PatientHistory): Promise<z.infer<typeof LifestyleSuggestionsOutputSchema>> {
  return lifestyleSuggesterFlow({
    detailedHistory: history,
    currentDate: new Date().toISOString().split('T')[0],
  });
}

// Define a new input schema for the prompt that includes the stringified notes
const PromptInputSchema = LifestyleSuggestionsInputSchema.extend({
    systemicNotesString: z.string().optional().describe('JSON string of systemic notes.'),
});


const prompt = ai.definePrompt({
  name: 'lifestyleSuggesterPrompt',
  input: {schema: PromptInputSchema }, // Use the extended schema
  output: {schema: LifestyleSuggestionsOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a proactive AI healthcare assistant. Your job is to provide 2-3 personalized, actionable health tips for a patient based on their profile and the current date.

**Current Date:** {{{currentDate}}}

**Patient Profile:**
-   **Past Medical History / Conditions:** {{{detailedHistory.pastMedicalHistory}}}
-   **Medications:** {{{detailedHistory.medicationHistory}}}
-   **Allergies:** {{{detailedHistory.allergyHistory}}}
-   **Social History:** {{{detailedHistory.socialHistory}}}
-   **Review of Systems:** {{{detailedHistory.reviewOfSystems}}}
-   **Systemic Notes:** {{{systemicNotesString}}}

**Task:**
Generate 2-3 unique, actionable health suggestions for the user for today. The suggestions should be a mix of general preventive care and tips specific to their conditions.

-   **Priority:** Assign a priority (High, Medium, Low) based on urgency and relevance. High priority for significant seasonal risks (like Dengue season) or critical health conditions.
-   **Personalization:** Tailor suggestions to the patient's conditions. For a hypertensive patient, suggest low-salt food choices. For a diabetic, remind them to check their feet.
-   **Seasonal Context:** Use the current date to infer the season and provide relevant advice (e.g., hydration in summer, flu prevention in winter).
-   **Variety:** Do not give the same tips every day. Be creative.

**Example Output:**
If it is Dengue season and the patient has hypertension:
-   Priority: High, Title: "Dengue Prevention", Suggestion: "Check for stagnant water..."
-   Priority: Medium, Title: "Manage Salt Intake", Suggestion: "Choose fresh vegetables over canned ones..."
-   Priority: Low, Title: "Stay Active", Suggestion: "A short 15-minute walk can do wonders for your blood pressure."

Respond in the structured JSON format.
`,
});

const lifestyleSuggesterFlow = ai.defineFlow(
  {
    name: 'lifestyleSuggesterFlow',
    inputSchema: LifestyleSuggestionsInputSchema,
    outputSchema: LifestyleSuggestionsOutputSchema,
  },
  async input => {
    // Pre-process the systemic notes into a string before calling the prompt.
    const systemicNotesString = JSON.stringify(input.detailedHistory.systemicNotes, null, 2);

    const promptInput = {
        ...input,
        systemicNotesString,
    };
    
    const {output} = await prompt(promptInput);
    return output!;
  }
);
