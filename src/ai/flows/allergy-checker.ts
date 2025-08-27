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

const AllergyCheckerInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication to check for allergies.'),
  patientAllergies: z.string().describe('A comma-separated list of patient allergies.'),
  isEmergency: z.boolean().describe('Whether this is an emergency situation.'),
  patientMedicalHistory: z
    .string()
    .optional()
    .describe('General patient medical history if not a detailed workup.'),
  detailedHistory: z
    .object({
      pastMedicalHistory: z.string().optional(),
      familyHistory: z.string().optional(),
      socialHistory: z.string().optional(),
      medicationHistory: z.string().optional(),
    })
    .optional()
    .describe('Detailed patient history for a non-emergency workup.'),
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
  prompt: `You are a clinical pharmacist specializing in drug allergies and cross-reactivity.

You will use the provided information to assess the allergy risk associated with prescribing a specific medication to a patient.

Medication to check: {{{medicationName}}}
Patient Allergies: {{{patientAllergies}}}

{{#if isEmergency}}
This is an emergency. Provide a rapid assessment based on the limited information.
{{else}}
This is a non-emergency workup. Consider the detailed history provided.
Patient Medical History: {{{patientMedicalHistory}}}
{{#if detailedHistory}}
Detailed History:
- Past Medical History: {{{detailedHistory.pastMedicalHistory}}}
- Family History: {{{detailedHistory.familyHistory}}}
- Social History: {{{detailedHistory.socialHistory}}}
- Medication History: {{{detailedHistory.medicationHistory}}}
{{/if}}
{{/if}}

Based on this information, determine if there is an allergy or cross-reactivity risk. Provide details about the risk, suggest alternative medication options, and offer guidance for the pharmacist.

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
