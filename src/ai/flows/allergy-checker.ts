
// Allergy Checker Flow
'use server';
/**
 * @fileOverview AI-powered allergy and cross-reactivity module.
 *
 * - allergyChecker - A function that handles the allergy checking process.
 * - AllergyCheckerInput - The input type for the allergyChecker function.
 * - AllergyCheckerOutput - The return type for the allergyChecker function.
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


const AllergyCheckerInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication to check for allergies.'),
  patientAllergies: z.string().describe('A comma-separated list of patient allergies (as a simple string).'),
  detailedHistory: detailedHistorySchema.describe('Detailed patient history for a comprehensive workup.'),
});
export type AllergyCheckerInput = z.infer<typeof AllergyCheckerInputSchema>;

const AllergyCheckerOutputSchema = z.object({
  allergyRiskDetected: z.boolean().describe('Whether an allergy or cross-reactivity risk is detected.'),
  riskDetails: z.string().describe('Details about the potential allergy or cross-reactivity risk.'),
  alternativeMedicationOptions: z.string().describe('Alternative medication options, if available.'),
  guidance: z.string().describe('Additional guidance for the pharmacist.'),
});
export type AllergyCheckerOutput = z.infer<typeof AllergyCheckerOutputSchema>;

export async function allergyChecker(input: AllergyCheckerInput): Promise<AllergyCheckerOutput> {
  return allergyCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'allergyCheckerPrompt',
  input: {schema: AllergyCheckerInputSchema},
  output: {schema: AllergyCheckerOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a clinical pharmacist specializing in drug allergies and cross-reactivity.

You will use the provided information to assess the allergy risk associated with prescribing a specific medication to a patient.

Medication to check: {{{medicationName}}}
Patient's listed allergies: {{{patientAllergies}}}

Use the patient's listed allergies as the primary source, but also consider the full detailed history for a comprehensive analysis.
The 'allergyHistory' field within the detailed history is the most important section for this task.

{{#if detailedHistory}}
## Detailed Patient History for Context
- **Demographics**: 
  - Name: {{detailedHistory.demographics.name}}, Age: {{detailedHistory.demographics.age}}, Gender: {{detailedHistory.demographics.gender}}
  - CNIC/Passport: {{detailedHistory.demographics.cnicOrPassport}}
  - Address: {{detailedHistory.demographics.address}}
  - Phone: {{detailedHistory.demographics.phoneNumber}}
- **Presenting Complaint**: {{detailedHistory.presentingComplaint}}
- **History of Presenting Illness**: {{detailedHistory.historyOfPresentingIllness}}
- **Past Medical History**: {{detailedHistory.pastMedicalHistory}}
- **Medication History**: {{detailedHistory.medicationHistory}}
- **Allergy & ADR History**: {{detailedHistory.allergyHistory}}
- **Family History**: {{detailedHistory.familyHistory}}
- **Social History**: {{detailedHistory.socialHistory}}
- **Immunization History**: {{detailedHistory.immunizationHistory}}
- **Review of Systems**: {{detailedHistory.reviewOfSystems}}
- **Lifestyle & Compliance**: {{detailedHistory.lifestyleAndCompliance}}
- **Patient's Ideas & Concerns**: {{detailedHistory.ideasAndConcerns}}
- **Pharmacist's Assessment**: {{detailedHistory.pharmacistAssessment}}
- **Care Plan**: {{detailedHistory.carePlan}}
{{/if}}

Based on all this information, determine if there is an allergy or cross-reactivity risk. Provide details about the risk, suggest alternative medication options, and offer guidance for the pharmacist.

Respond in the format specified by the AllergyCheckerOutputSchema.`,
});

const allergyCheckerFlow = ai.defineFlow(
  {
    name: 'allergyCheckerFlow',
    inputSchema: AllergyCheckerInputSchema,
    outputSchema: AllergyCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
