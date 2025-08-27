'use server';
/**
 * @fileOverview Drug Monograph Lookup AI agent.
 *
 * - drugMonographLookup - A function that handles the drug monograph lookup process.
 * - DrugMonographLookupInput - The input type for the drugMonographLookup function.
 * - DrugMonographLookupOutput - The return type for the drugMonographLookup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DrugMonographLookupInputSchema = z.object({
  drugName: z.string().describe('The name of the drug to lookup.'),
});
export type DrugMonographLookupInput = z.infer<typeof DrugMonographLookupInputSchema>;

const DrugMonographLookupOutputSchema = z.object({
  monograph: z.string().describe('The comprehensive drug monograph information.'),
});
export type DrugMonographLookupOutput = z.infer<typeof DrugMonographLookupOutputSchema>;

export async function drugMonographLookup(input: DrugMonographLookupInput): Promise<DrugMonographLookupOutput> {
  return drugMonographLookupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'drugMonographLookupPrompt',
  input: {schema: DrugMonographLookupInputSchema},
  output: {schema: DrugMonographLookupOutputSchema},
  prompt: `You are a highly skilled pharmacist providing a drug monograph for {{drugName}}.

  Provide a comprehensive drug monograph including the following information:
  - Mechanism of Action (MOA)
  - Pharmacokinetics/Pharmacodynamics (PK/PD)
  - Indications
  - Contraindications
  - Side Effects
  - Monitoring
  - Dosing
  - Administration
  - Storage
  - Pregnancy/Lactation Information
  - Drug Interactions
  - Clinical Trials Information
  - Other Information
  `,
});

const drugMonographLookupFlow = ai.defineFlow(
  {
    name: 'drugMonographLookupFlow',
    inputSchema: DrugMonographLookupInputSchema,
    outputSchema: DrugMonographLookupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
