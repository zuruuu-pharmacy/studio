'use server';

/**
 * @fileOverview An AI-powered drug interaction engine.
 *
 * - checkDrugInteractions - A function that checks for drug interactions.
 * - CheckDrugInteractionsInput - The input type for the checkDrugInteractions function.
 * - CheckDrugInteractionsOutput - The return type for the checkDrugInteractions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckDrugInteractionsInputSchema = z.object({
  medications: z
    .array(z.string())
    .describe('A list of medications to check for interactions.'),
  labResults: z
    .string()
    .optional()
    .describe('Additional relevant lab results to consider.'),
});
export type CheckDrugInteractionsInput = z.infer<
  typeof CheckDrugInteractionsInputSchema
>;

const CheckDrugInteractionsOutputSchema = z.object({
  interactions: z.array(z.object({
    severity: z.string().describe('The severity of the interaction.'),
    mechanism: z.string().describe('The mechanism of the interaction.'),
    suggestedActions: z.string().describe('Suggested actions or alternatives.'),
    interactingDrugs: z.array(z.string()).describe('The drugs (or food) involved in the interaction.')
  })).describe('A list of drug interactions, including drug-food interactions.'),
});
export type CheckDrugInteractionsOutput = z.infer<
  typeof CheckDrugInteractionsOutputSchema
>;

export async function checkDrugInteractions(
  input: CheckDrugInteractionsInput
): Promise<CheckDrugInteractionsOutput> {
  return checkDrugInteractionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkDrugInteractionsPrompt',
  input: {schema: CheckDrugInteractionsInputSchema},
  output: {schema: CheckDrugInteractionsOutputSchema},
  prompt: `You are a clinical pharmacist expert in drug interactions.

You will analyze the provided list of medications and lab results (if any) to identify potential drug-drug and drug-food interactions.
For each interaction, you will determine the severity, mechanism, and suggest appropriate actions or alternatives.

Medications: {{medications}}
Lab Results: {{labResults}}

Consider the following:
*   Pay attention to potential interactions, even if the patient does not have lab results.
*   For each interaction include all the drugs involved, not just the primary pair.
*   When identifying a drug-food interaction, list the drug and "Food" in the interactingDrugs array.
*   Be concise and clear in your explanations.
`,
});

const checkDrugInteractionsFlow = ai.defineFlow(
  {
    name: 'checkDrugInteractionsFlow',
    inputSchema: CheckDrugInteractionsInputSchema,
    outputSchema: CheckDrugInteractionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
