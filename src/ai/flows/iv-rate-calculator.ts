
'use server';

/**
 * @fileOverview An AI dose calculator that calculates IV infusion rates.
 *
 * - ivRateCalculator - A function that handles the IV rate calculation process.
 * - IvRateCalculatorInput - The input type for the function.
 * - IvRateCalculatorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IvRateCalculatorInputSchema = z.object({
  totalVolumeMl: z.coerce.number().positive('Total volume must be a positive number.'),
  totalTimeMinutes: z.coerce.number().positive('Total time must be a positive number.'),
  dropFactorGttMl: z.coerce.number().positive('Drop factor must be a positive number.'),
});
export type IvRateCalculatorInput = z.infer<typeof IvRateCalculatorInputSchema>;

const IvRateCalculatorOutputSchema = z.object({
  infusionRateMlHr: z.string().describe('The calculated infusion rate in mL/hour, rounded to one decimal place.'),
  dropsPerMinute: z.string().describe('The calculated drop rate in drops/minute, rounded to the nearest whole number.'),
  mlHrCalculationSteps: z.string().describe('The step-by-step calculation for mL/hour.'),
  gttMinCalculationSteps: z.string().describe('The step-by-step calculation for drops/minute.'),
});
export type IvRateCalculatorOutput = z.infer<typeof IvRateCalculatorOutputSchema>;

export async function ivRateCalculator(input: IvRateCalculatorInput): Promise<IvRateCalculatorOutput> {
  return ivRateCalculatorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'ivRateCalculatorPrompt',
  input: {schema: IvRateCalculatorInputSchema},
  output: {schema: IvRateCalculatorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert pharmacist specializing in IV infusion calculations. Your task is to perform the calculations with extreme precision and show all your work.

**Infusion Parameters:**
- Total Volume: {{{totalVolumeMl}}} mL
- Total Time: {{{totalTimeMinutes}}} minutes
- Drop Factor: {{{dropFactorGttMl}}} gtt/mL

**Part 1: Calculate Infusion Rate in mL/hour**

1.  **Convert Time:** First, convert the total infusion time from minutes to hours.
    -   Formula: Time (hr) = Time (min) / 60
2.  **Calculate Rate:** Now, calculate the rate in mL/hr.
    -   Formula: Rate (mL/hr) = Total Volume (mL) / Time (hr)
3.  **Result:** Round the final answer to one decimal place.
4.  **Show Work:** Combine these steps into a clear, readable 'mlHrCalculationSteps' string.

**Part 2: Calculate Drop Rate in drops/minute**

1.  **Calculate Rate:** First, calculate the infusion rate in mL/minute.
    -   Formula: Rate (mL/min) = Total Volume (mL) / Total Time (min)
2.  **Calculate Drop Rate:** Now, calculate the drops per minute.
    -   Formula: Drops/min = Rate (mL/min) × Drop Factor (gtt/mL)
3.  **Result:** Round the final answer to the nearest whole number, as you cannot have a fraction of a drop.
4.  **Show Work:** Combine these steps into a clear, readable 'gttMinCalculationSteps' string.

Respond ONLY in the structured JSON format defined by the output schema.
`,
});


const ivRateCalculatorFlow = ai.defineFlow(
  {
    name: 'ivRateCalculatorFlow',
    inputSchema: IvRateCalculatorInputSchema,
    outputSchema: IvRateCalculatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
