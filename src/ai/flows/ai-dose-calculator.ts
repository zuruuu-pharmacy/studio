'use server';

/**
 * @fileOverview An AI dose calculator that calculates dosages based on patient-specific factors.
 *
 * - calculateDosage - A function that handles the dosage calculation process.
 * - CalculateDosageInput - The input type for the calculateDosage function.
 * - CalculateDosageOutput - The return type for the calculateDosage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateDosageInputSchema = z.object({
  drugName: z.string().describe('The name of the drug.'),
  patientWeightKg: z.number().describe('The patient\u2019s weight in kilograms.'),
  patientAgeYears: z.number().describe('The patient\u2019s age in years.'),
  indication: z.string().describe('The patient\'s condition or reason for taking the medication (e.g., "Community-acquired pneumonia").'),
  renalFunction: z
    .string()
    .optional()
    .describe('The patient\u2019s renal function (e.g., normal, mild impairment, severe impairment).'),
  hepaticFunction:
    z.string().optional().describe('The patient\u2019s hepatic function (e.g., normal, mild impairment, severe impairment).'),
  availableFormulations: z
    .string()
    .optional()
    .describe('Available formulations of the drug (e.g., 250mg tablets, 500mg tablets).'),
});

export type CalculateDosageInput = z.infer<typeof CalculateDosageInputSchema>;

const CalculateDosageOutputSchema = z.object({
  isIndicationMismatch: z.boolean().describe('Whether the drug is inappropriate for the given indication.'),
  mismatchWarning: z.string().optional().describe('A warning message if the indication is mismatched.'),
  calculatedDosage: z.string().optional().describe('The calculated dosage of the drug.'),
  calculationSteps: z.string().optional().describe('The steps taken to calculate the dosage, using general formulas.'),
  references: z.string().optional().describe('References or sources used for the dosage calculation.'),
  roundedDosageSuggestion: z
    .string()
    .optional()
    .describe('Suggested rounded dosage based on available formulations.'),
});

export type CalculateDosageOutput = z.infer<typeof CalculateDosageOutputSchema>;

export async function calculateDosage(input: CalculateDosageInput): Promise<CalculateDosageOutput> {
  return calculateDosageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateDosagePrompt',
  input: {schema: CalculateDosageInputSchema},
  output: {schema: CalculateDosageOutputSchema},
  prompt: `You are an expert pharmacist specializing in calculating drug dosages based on patient-specific factors and the indication for the medication.

  First, critically evaluate if the provided 'Drug Name' is a standard and appropriate treatment for the given 'Indication'.
  
  - If the drug is NOT appropriate for the indication, set 'isIndicationMismatch' to true and provide a concise warning in 'mismatchWarning' explaining why (e.g., "{{drugName}} is not used to treat {{indication}}."). Do not proceed with any dosage calculation.

  - If the drug IS appropriate for the indication, set 'isIndicationMismatch' to false and proceed with the dosage calculation.

  When calculating, use standard clinical formulas (e.g., mg/kg/day). Show all calculation steps and references. The dosage is highly dependent on the reason the patient is taking the medication.
  If available formulations are provided, and if appropriate, consider recommending a rounded dosage.

  Drug Name: {{{drugName}}}
  Indication: {{{indication}}}
  Patient Weight (kg): {{{patientWeightKg}}}
  Patient Age (years): {{{patientAgeYears}}}
  Renal Function: {{{renalFunction}}}
  Hepatic Function: {{{hepaticFunction}}}
  Available Formulations: {{{availableFormulations}}}
`,
});

const calculateDosageFlow = ai.defineFlow(
  {
    name: 'calculateDosageFlow',
    inputSchema: CalculateDosageInputSchema,
    outputSchema: CalculateDosageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
