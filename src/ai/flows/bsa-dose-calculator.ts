
'use server';

/**
 * @fileOverview An AI dose calculator that calculates dosages based on Body Surface Area (BSA).
 *
 * - bsaDoseCalculator - A function that handles the BSA-based dosage calculation process.
 * - BsaDoseCalculatorInput - The input type for the function.
 * - BsaDoseCalculatorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BsaDoseCalculatorInputSchema = z.object({
  drugName: z.string().describe('The name of the drug.'),
  patientWeightKg: z.number().describe('The patient\u2019s weight in kilograms.'),
  patientHeightCm: z.number().describe('The patient\u2019s height in centimeters.'),
  dosePerM2: z.string().describe('The prescribed dose per square meter (e.g., "100mg/m²", "300 mg/m^2").'),
});

export type BsaDoseCalculatorInput = z.infer<typeof BsaDoseCalculatorInputSchema>;

const BsaDoseCalculatorOutputSchema = z.object({
  bodySurfaceArea: z.string().describe('The calculated Body Surface Area (BSA) in m², rounded to two decimal places.'),
  totalDose: z.string().describe('The calculated total dose of the drug, including units.'),
  calculationSteps: z.string().describe('The steps taken to calculate the dosage, showing the formula and substitution.'),
  explanation: z.string().describe('A brief explanation of BSA-based dosing and its common uses.'),
});

export type BsaDoseCalculatorOutput = z.infer<typeof BsaDoseCalculatorOutputSchema>;

export async function bsaDoseCalculator(input: BsaDoseCalculatorInput): Promise<BsaDoseCalculatorOutput> {
  return bsaDoseCalculatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bsaDoseCalculatorPrompt',
  input: {schema: BsaDoseCalculatorInputSchema},
  output: {schema: BsaDoseCalculatorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert pharmacist specializing in calculating drug dosages based on Body Surface Area (BSA).

Your task is to perform the calculation and show all your work clearly.

**Patient & Drug Info:**
- Drug Name: {{{drugName}}}
- Patient Weight: {{{patientWeightKg}}} kg
- Patient Height: {{{patientHeightCm}}} cm
- Prescribed Dose: {{{dosePerM2}}}

**Calculation Steps:**
1.  **Calculate BSA:** Use the Mosteller formula: BSA (m²) = √((Height (cm) × Weight (kg)) / 3600).
    - Show the formula.
    - Show the substitution of the values into the formula.
    - Calculate the result and round it to two decimal places. This is the 'bodySurfaceArea'.
2.  **Calculate Total Dose:**
    - The formula is: Total Dose = BSA (m²) × Dose per m².
    - Extract the numeric value from the 'dosePerM2' input (e.g., from "100mg/m²", use 100).
    - Show the formula and substitution.
    - Calculate the final 'totalDose' and ensure it includes the correct units (e.g., mg).
3.  **Provide Explanation:** Write a short, clear explanation of what BSA is and why it's used, particularly in fields like oncology.

Combine the calculation steps for BSA and the total dose into a single, easy-to-read 'calculationSteps' string.

Respond ONLY in the structured JSON format defined by the output schema.
`,
});

const bsaDoseCalculatorFlow = ai.defineFlow(
  {
    name: 'bsaDoseCalculatorFlow',
    inputSchema: BsaDoseCalculatorInputSchema,
    outputSchema: BsaDoseCalculatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
