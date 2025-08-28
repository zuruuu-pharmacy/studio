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
  pharmacology: z.object({
    mechanismOfAction: z.string().describe('The mechanism of action (MOA).'),
    pharmacokinetics: z.string().describe('The pharmacokinetics and pharmacodynamics (PK/PD).'),
    indications: z.string().describe('The approved indications for the drug.'),
    contraindications: z.string().describe('Situations where the drug should not be used.'),
    sideEffects: z.string().describe('Common and severe side effects.'),
    monitoring: z.string().describe('Parameters to monitor during therapy.'),
  }),
  pharmaceutical: z.object({
    dosing: z.string().describe('Recommended dosing for different indications and populations.'),
    administration: z.string().describe('Instructions for how to administer the drug.'),
    storage: z.string().describe('Proper storage conditions.'),
    drugInteractions: z.string().describe('Known drug-drug or drug-food interactions.'),
  }),
  research: z.object({
    pregnancyLactation: z.string().describe('Information regarding use in pregnancy and lactation.'),
    clinicalTrials: z.string().describe('Summary of key clinical trials information.'),
    otherInformation: z.string().describe('Any other relevant information or off-label uses.'),
  }),
});
export type DrugMonographLookupOutput = z.infer<typeof DrugMonographLookupOutputSchema>;

export async function drugMonographLookup(input: DrugMonographLookupInput): Promise<DrugMonographLookupOutput> {
  return drugMonographLookupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'drugMonographLookupPrompt',
  input: {schema: DrugMonographLookupInputSchema},
  output: {schema: DrugMonographLookupOutputSchema},
  prompt: `You are a highly skilled pharmacist providing a structured drug monograph for {{drugName}}.

  Provide a comprehensive drug monograph organized into the following sections:

  ## Pharmacology
  - **Mechanism of Action (MOA)**
  - **Pharmacokinetics/Pharmacodynamics (PK/PD)**
  - **Indications**
  - **Contraindications**
  - **Side Effects**
  - **Monitoring**

  ## Pharmaceutical
  - **Dosing**
  - **Administration**
  - **Storage**
  - **Drug Interactions**

  ## Research
  - **Pregnancy/Lactation Information**
  - **Clinical Trials Information**
  - **Other Information** (including any notable off-label uses)
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
