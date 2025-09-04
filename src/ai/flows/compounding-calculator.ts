
'use server';

/**
 * @fileOverview An AI dose calculator that calculates quantities for compounded preparations.
 *
 * - compoundingCalculator - A function that handles the compounding calculation process.
 * - CompoundingCalculatorInput - The input type for the function.
 * - CompoundingCalculatorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompoundingCalculatorInputSchema = z.object({
  preparationType: z.enum(['w/v', 'v/v', 'w/w']).describe('The type of preparation (% w/v, % v/v, or % w/w).'),
  desiredVolumeMl: z.coerce.number().positive('Total volume must be a positive number.').optional().describe('The final volume of the preparation in mL. Required for w/v and v/v.'),
  desiredWeightG: z.coerce.number().positive('Total weight must be a positive number.').optional().describe('The final weight of the preparation in grams. Required for w/w.'),
  percentageStrength: z.coerce.number().positive('Percentage strength must be a positive number.'),
});
export type CompoundingCalculatorInput = z.infer<typeof CompoundingCalculatorInputSchema>;

const CompoundingCalculatorOutputSchema = z.object({
  soluteNeeded: z.string().describe('The calculated amount of solute needed, including units (g or mL).'),
  calculationSteps: z.string().describe('The step-by-step calculation, including the definition of the percentage strength used.'),
  explanation: z.string().describe('A brief explanation of this type of compounding calculation.'),
});
export type CompoundingCalculatorOutput = z.infer<typeof CompoundingCalculatorOutputSchema>;

export async function compoundingCalculator(input: CompoundingCalculatorInput): Promise<CompoundingCalculatorOutput> {
  return compoundingCalculatorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'compoundingCalculatorPrompt',
  input: {schema: CompoundingCalculatorInputSchema},
  output: {schema: CompoundingCalculatorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert pharmacist specializing in pharmaceutical compounding calculations. Your task is to perform the calculation with extreme precision and show all your work.

**Preparation Parameters:**
- Preparation Type: {{{preparationType}}}
- Desired Volume: {{{desiredVolumeMl}}} mL
- Desired Weight: {{{desiredWeightG}}} g
- Percentage Strength: {{{percentageStrength}}}%

**Your Task:**
1.  **Define the Strength:** Start by defining what the percentage strength means in this context.
    -   For '% w/v', it's 'grams of solute in 100 mL of solution'.
    -   For '% v/v', it's 'mL of solute in 100 mL of solution'.
    -   For '% w/w', it's 'grams of solute in 100 g of final product'.
2.  **State the Formula:** Set up a simple ratio and proportion equation to solve for the unknown amount of solute.
    -   Example for w/v: (X g / Desired Volume mL) = (Percentage Strength g / 100 mL)
3.  **Solve for X:** Show the substitution and solve for X, which is the 'soluteNeeded'. Ensure the units are correct (g for w/v and w/w, mL for v/v).
4.  **Combine Steps:** Combine the definition, formula, and solution into a clear, readable 'calculationSteps' string.
5.  **Explain:** Provide a brief, clear 'explanation' of the calculation type.

Respond ONLY in the structured JSON format defined by the output schema.
`,
});


const compoundingCalculatorFlow = ai.defineFlow(
  {
    name: 'compoundingCalculatorFlow',
    inputSchema: CompoundingCalculatorInputSchema,
    outputSchema: CompoundingCalculatorOutputSchema,
  },
  async input => {
    // Basic validation to ensure the correct inputs are provided for the type
    if (input.preparationType.includes('v') && !input.desiredVolumeMl) {
        throw new Error('Desired volume (mL) is required for w/v and v/v preparations.');
    }
    if (input.preparationType === 'w/w' && !input.desiredWeightG) {
        throw new Error('Desired weight (g) is required for w/w preparations.');
    }

    const {output} = await prompt(input);
    return output!;
  }
);
