
'use server';
/**
 * @fileOverview Digital Formulary Reference & Comparison Tool
 *
 * - drugFormularyLookup - A function that handles the drug formulary lookup process.
 * - DrugFormularyInput - The input type for the drugFormularyLookup function.
 * - DrugFormularyOutput - The return type for the drugFormularyLookup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DrugFormularyInputSchema = z.object({
  drugName: z.string().describe('The generic name of the drug to look up.'),
});
export type DrugFormularyInput = z.infer<typeof DrugFormularyInputSchema>;

const DrugFormularyOutputSchema = z.object({
  genericName: z.string().describe('The official generic name (INN) of the drug.'),
  brandNames: z.string().describe('A comma-separated list of common local and international brand names.'),
  therapeuticClass: z.string().describe('The primary therapeutic and pharmacological class of the drug.'),
  dosageForms: z.string().describe('A list of available dosage forms and their strengths (e.g., "Tablet: 250mg, 500mg; Suspension: 125mg/5mL").'),
  dosing: z.object({
      adult: z.string().describe('Standard adult dosing guidelines, including route and frequency.'),
      pediatric: z.string().describe('Standard pediatric dosing guidelines.'),
      renalImpairment: z.string().describe('Dosing adjustments for patients with renal impairment.'),
      hepaticImpairment: z.string().describe('Dosing adjustments for patients with hepatic impairment.'),
  }),
  indications: z.string().describe('A list of approved and common off-label clinical uses.'),
  contraindicationsAndWarnings: z.string().describe('A list of absolute contraindications and key warnings/precautions (e.g., for pregnancy, elderly).'),
  adverseDrugReactions: z.string().describe('A list of common and serious adverse drug reactions.'),
  drugInteractions: z.string().describe('A summary of the most clinically significant drug-drug and drug-food interactions.'),
  formularyComparisonNotes: z.string().describe('A summary of key differences in dosing, indications, or availability between major formularies like BNF, USP, and local guidelines.'),
  therapeuticAlternatives: z.string().describe('A list of suggested therapeutic alternatives, both within the same class and from different classes.'),
});
export type DrugFormularyOutput = z.infer<typeof DrugFormularyOutputSchema>;

export async function drugFormularyLookup(input: DrugFormularyInput): Promise<DrugFormularyOutput> {
  return drugFormularyLookupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'drugFormularyLookupPrompt',
  input: {schema: DrugFormularyInputSchema},
  output: {schema: DrugFormularyOutputSchema},
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are an expert Clinical Drug Formulary Generator. Your task is to create a concise, structured, and clinically useful summary for {{{drugName}}}, drawing from BNF, USP, and standard Local Formularies.

Provide a comprehensive summary adhering to the specified JSON format. The information must be accurate, relevant, and targeted for pharmacy/medical students and clinicians.

**Key Instructions:**
1.  **Be Specific:** For dosage forms, list the strengths (e.g., Tablet: 10mg, 20mg).
2.  **Be Comprehensive:** Cover adult and pediatric dosing, and adjustments for renal/hepatic impairment.
3.  **Highlight Differences:** The 'formularyComparisonNotes' field is critical. Explicitly state any significant differences between major formularies (BNF, USP, Local) regarding dosing, approved uses, or warnings.
4.  **Be Practical:** For 'therapeuticAlternatives', suggest viable alternatives a clinician might consider if the primary drug is unavailable or contraindicated.
5.  **Focus on Clinical Relevance:** For interactions and ADRs, focus on the most common and clinically significant ones.
`,
});

const drugFormularyLookupFlow = ai.defineFlow(
  {
    name: 'drugFormularyLookupFlow',
    inputSchema: DrugFormularyInputSchema,
    outputSchema: DrugFormularyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
