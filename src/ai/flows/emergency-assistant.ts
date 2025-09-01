
'use server';
/**
 * @fileOverview AI-powered emergency assistant.
 *
 * - getEmergencyAssistance - A function that generates an emergency payload.
 * - EmergencyAssistanceInput - The input type for the function.
 * - EmergencyAssistanceOutput - The return type for the function.
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

const EmergencyAssistanceInputSchema = z.object({
  detailedHistory: detailedHistorySchema.describe('Detailed patient history for a comprehensive workup.'),
  // In a real app, you'd pass real location data.
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional(),
});
export type EmergencyAssistanceInput = z.infer<typeof EmergencyAssistanceInputSchema>;

const EmergencyAssistanceOutputSchema = z.object({
    patientSummary: z.object({
        name: z.string().describe("Patient's full name."),
        age: z.string().describe("Patient's age."),
        gender: z.string().describe("Patient's gender."),
        bloodGroup: z.string().describe("Patient's blood group (if known)."),
        allergies: z.string().describe("Critical allergies."),
        currentMedications: z.string().describe("Key current medications."),
        chronicConditions: z.string().describe("Critical chronic conditions (e.g., Diabetes, Hypertension).")
    }).describe("A summary of the patient's critical medical information (Medical Wallet)."),
    formattedSms: z.string().describe("A pre-formatted, concise SMS message ready to be sent to emergency services and contacts."),
    firstAidTips: z.string().optional().describe("Simple, on-the-spot first aid tips for a caregiver based on the patient's likely condition."),
    primaryRisk: z.string().optional().describe("The most likely primary risk based on history (e.g., 'Known cardiac patient - possible heart attack')."),
});
export type EmergencyAssistanceOutput = z.infer<typeof EmergencyAssistanceOutputSchema>;


export async function getEmergencyAssistance(input: EmergencyAssistanceInput): Promise<EmergencyAssistanceOutput> {
  return emergencyAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emergencyAssistantPrompt',
  input: {schema: EmergencyAssistanceInputSchema},
  output: {schema: EmergencyAssistanceOutputSchema},
  prompt: `You are an AI emergency assistant. Your role is to immediately process a patient's health data upon an emergency trigger and create a structured, actionable alert.

**Patient's Medical Data:**
- Name: {{{detailedHistory.demographics.name}}}
- Age: {{{detailedHistory.demographics.age}}}
- Gender: {{{detailedHistory.demographics.gender}}}
- Past Medical History / Chronic Conditions: {{{detailedHistory.pastMedicalHistory}}}
- Current Medications: {{{detailedHistory.medicationHistory}}}
- Allergies: {{{detailedHistory.allergyHistory}}}
- Social History: {{{detailedHistory.socialHistory}}}

**Your Task:**
1.  **Create a Patient Summary**: Extract the most critical information into the 'patientSummary' object. Be concise. For blood group, state 'Unknown' if not available.
2.  **Identify Primary Risk**: Based on the history, determine the most immediate, likely risk. For example, if the patient has a history of hypertension and chest pain complaints, state 'Known cardiac patient'. If they have epilepsy, state 'Known epileptic patient'.
3.  **Generate First Aid Tips**: Provide 1-2 very simple, actionable first aid tips a layperson could perform while waiting for help. Base this on the primary risk. (e.g., for cardiac risk: "Help them sit down and stay calm."; for seizure risk: "Lay them on their side, clear the area of hard objects.").
4.  **Format an Emergency SMS**: Create a clear, concise emergency message. It MUST start with "🚨 Emergency Alert 🚨" and include Name, Age, a summary of conditions, and a placeholder for location. Keep it very short.

**Example SMS:**
🚨 Emergency Alert 🚨
Help needed for Ali Khan (55). Has Hypertension, Diabetes. Allergies: Penicillin. At [Location].

Now, generate the emergency payload based on the provided patient data.
`,
});


const emergencyAssistantFlow = ai.defineFlow(
  {
    name: 'emergencyAssistantFlow',
    inputSchema: EmergencyAssistanceInputSchema,
    outputSchema: EmergencyAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
