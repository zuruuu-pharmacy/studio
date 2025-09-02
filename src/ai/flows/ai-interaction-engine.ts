
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
    severity: z.string().describe('The severity of the interaction (e.g., High, Moderate, Low).'),
    mechanism: z.string().describe('The mechanism of the interaction.'),
    suggestedActions: z.string().describe('Suggested actions or alternatives.'),
    interactingDrugs: z.array(z.string()).describe('The drugs (or food) involved in the interaction.'),
    clinicalConsequences: z.string().describe("The potential clinical outcomes of the interaction (e.g., 'Increased risk of bleeding', 'Serotonin syndrome')."),
    saferAlternative: z.string().optional().describe("A safer drug alternative, if one is clearly appropriate."),
    educationalNote: z.string().optional().describe("A brief educational note explaining the interaction simply.")
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
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are a clinical pharmacist expert in drug interactions, acting as a Drug Interaction Simulator for students.

You will analyze the provided list of medications and lab results (if any) to identify potential drug-drug and drug-food interactions.
For each interaction, you must be comprehensive and educational.

Medications: {{medications}}
Lab Results: {{labResults}}

**For each interaction found, you MUST provide:**
1.  **Severity:** Classify as High, Moderate, or Low.
2.  **Interacting Drugs:** List all drugs involved (or 'Food').
3.  **Mechanism:** Explain the pharmacokinetic or pharmacodynamic mechanism.
4.  **Clinical Consequences:** Describe the potential adverse outcomes for the patient.
5.  **Suggested Actions:** Provide clear, actionable advice (e.g., avoid, monitor, adjust dose).
6.  **Safer Alternative:** If applicable, suggest a safer alternative drug and briefly explain why it's safer.
7.  **Educational Note:** A concise, easy-to-understand summary of the interaction, perfect for a flashcard.

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
