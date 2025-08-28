
'use server';
/**
 * @fileOverview AI-powered drug-food interaction checker.
 *
 * - checkDrugFoodInteraction - A function that handles checking for a single drug-food interaction.
 * - CheckDrugFoodInteractionInput - The input type for the checkDrugFoodInteraction function.
 * - CheckDrugFoodInteractionOutput - The return type for the checkDrugFoodInteraction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckDrugFoodInteractionInputSchema = z.object({
  drugName: z.string().describe('The name of the medication to check.'),
});
export type CheckDrugFoodInteractionInput = z.infer<typeof CheckDrugFoodInteractionInputSchema>;

const CheckDrugFoodInteractionOutputSchema = z.object({
  interactionExists: z.boolean().describe('Whether a significant food interaction exists for the drug.'),
  severity: z.string().describe('The severity of the interaction (e.g., High, Moderate, Low, or N/A).'),
  details: z.string().describe('A summary of the interaction or a confirmation that none exists.'),
  mechanism: z.string().optional().describe('The mechanism of the interaction, if applicable.'),
  management: z.string().describe('Recommendations for managing the interaction (e.g., "Take with food," "Avoid grapefruit juice").'),
});
export type CheckDrugFoodInteractionOutput = z.infer<typeof CheckDrugFoodInteractionOutputSchema>;

export async function checkDrugFoodInteraction(input: CheckDrugFoodInteractionInput): Promise<CheckDrugFoodInteractionOutput> {
  return checkDrugFoodInteractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkDrugFoodInteractionPrompt',
  input: {schema: CheckDrugFoodInteractionInputSchema},
  output: {schema: CheckDrugFoodInteractionOutputSchema},
  prompt: `You are a clinical pharmacist expert in drug-food interactions.

  Analyze the provided medication to identify its most significant and common food interaction. If there are multiple, focus on the one with the highest clinical relevance.

  - If a significant interaction exists, set 'interactionExists' to true and provide the severity, details, mechanism, and management advice.
  - If no clinically significant food interactions are known, set 'interactionExists' to false, set severity to "N/A", and provide a brief confirmation in the 'details' field.

  Drug Name: {{{drugName}}}
  `,
});

const checkDrugFoodInteractionFlow = ai.defineFlow(
  {
    name: 'checkDrugFoodInteractionFlow',
    inputSchema: CheckDrugFoodInteractionInputSchema,
    outputSchema: CheckDrugFoodInteractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
