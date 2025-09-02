
'use server';
/**
 * @fileOverview AI-powered herbal & natural products knowledge hub.
 *
 * - getHerbalInfo - A function that returns detailed information about a medicinal plant.
 * - HerbalInfoInput - The input type for the getHerbalInfo function.
 * - HerbalInfoOutput - The return type for the getHerbalInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HerbalInfoInputSchema = z.object({
  plantName: z.string().describe('The botanical or common name of the plant.'),
});

const HerbalInfoOutputSchema = z.object({
    botanicalName: z.string().describe('The scientific botanical name of the plant.'),
    commonNames: z.string().describe('A comma-separated list of common names (e.g., Sarpagandha, Indian snakeroot).'),
    family: z.string().describe('The plant family (e.g., Apocynaceae).'),
    morphologicalFeatures: z.string().describe('A brief description of the key morphological features (root, leaves, flowers).'),
    activeConstituents: z.string().describe('A comma-separated list of the main active phytochemicals (e.g., Reserpine, Ajmaline).'),
    therapeuticUses: z.string().describe('A comma-separated list of the primary therapeutic uses (e.g., Antihypertensive, Antiarrhythmic).'),
    dosageForms: z.string().describe('Common dosage forms available (e.g., Crude root powder, tablet).'),
    preparationExtraction: z.string().describe('A brief note on how the active compounds are prepared or extracted.'),
    herbalDrugInteractions: z.string().describe('Known clinically significant interactions with modern drugs.'),
    syntheticAlternatives: z.string().describe('A comparison with a common synthetic drug used for a similar purpose.'),
    historicalCulturalUse: z.string().describe('A brief note on its use in traditional medicine (e.g., Ayurveda, TCM).'),
});

export type HerbalInfoInput = z.infer<typeof HerbalInfoInputSchema>;
export type HerbalInfoOutput = z.infer<typeof HerbalInfoOutputSchema>;

export async function getHerbalInfo(input: HerbalInfoInput): Promise<HerbalInfoOutput> {
  return herbalKnowledgeHubFlow(input);
}


const prompt = ai.definePrompt({
  name: 'herbalKnowledgeHubPrompt',
  input: {schema: HerbalInfoInputSchema},
  output: {schema: HerbalInfoOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert pharmaco-botanist, creating a detailed knowledge card for a pharmacy student about the medicinal plant: {{{plantName}}}.

Provide a comprehensive, structured response covering the following areas. Be concise and accurate.

-   **Botanical Name**: The correct scientific name.
-   **Common Names**: List the most common names.
-   **Family**: The botanical family.
-   **Morphological Features**: Key identifying features of the plant parts.
-   **Active Constituents**: The primary active chemical compounds.
-   **Therapeutic Uses**: The main pharmacological uses.
-   **Dosage Forms**: How it is typically prepared and sold.
-   **Preparation/Extraction**: A simple summary of the extraction process.
-   **Herbal–Drug Interactions**: The most critical interactions with synthetic drugs.
-   **Synthetic Alternatives**: A relevant modern drug that can be used as a comparison.
-   **Historical/Cultural Use**: Its significance in traditional medicine systems.

Respond ONLY with the structured JSON output.
`,
});


const herbalKnowledgeHubFlow = ai.defineFlow(
  {
    name: 'herbalKnowledgeHubFlow',
    inputSchema: HerbalInfoInputSchema,
    outputSchema: HerbalInfoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
