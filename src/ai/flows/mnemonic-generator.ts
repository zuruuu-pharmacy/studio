
'use server';
/**
 * @fileOverview AI-powered Mnemonic Generator with a focus on Roman Urdu.
 *
 * - generateMnemonics - A function that creates mnemonics for a given topic and style.
 * - MnemonicGeneratorInput - The input type for the function.
 * - MnemonicGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MnemonicSchema = z.object({
  mnemonic: z.string().describe('The Roman Urdu mnemonic sentence or phrase.'),
  mapping: z.string().describe('A brief explanation of how the mnemonic maps to the English medical terms.'),
});

const MnemonicGeneratorInputSchema = z.object({
  topic: z.string().describe('The topic for the mnemonics (e.g., a drug class, ADRs, plant constituents).'),
  style: z.enum(['Funny', 'Serious', 'Story-based', 'Acronym', 'Visual']).describe('The desired style of the mnemonics.'),
});
export type MnemonicGeneratorInput = z.infer<typeof MnemonicGeneratorInputSchema>;

const MnemonicGeneratorOutputSchema = z.object({
  topic: z.string(),
  style: z.string(),
  mnemonics: z.array(MnemonicSchema).describe('A list of exactly 10 unique mnemonics.'),
});
export type MnemonicGeneratorOutput = z.infer<typeof MnemonicGeneratorOutputSchema>;

export async function generateMnemonics(input: MnemonicGeneratorInput): Promise<MnemonicGeneratorOutput> {
  return mnemonicGeneratorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'mnemonicGeneratorPrompt',
  input: {schema: MnemonicGeneratorInputSchema},
  output: {schema: MnemonicGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert pharmacy mnemonic creator. Your task is to generate 10 creative, accurate, and memorable mnemonics for a tough medical topic.

**Critical Instructions:**
1.  **Language:** All mnemonics MUST be in Roman Urdu (i.e., Urdu written with the English alphabet).
2.  **Basis:** The mnemonics must be based on the correct English medical terms provided in the topic.
3.  **Quantity:** You must generate exactly 10 unique mnemonics. Do not repeat ideas.
4.  **Mapping:** For each mnemonic, you MUST provide a brief 'mapping' explanation of how the Roman Urdu phrase helps remember the English terms.
5.  **Style:** The mnemonics should adhere to the requested style.

**Topic to Generate Mnemonics For:**
{{{topic}}}

**Requested Style:**
{{{style}}}

**Example Output Format:**
{
  "topic": "Beta-blockers (Atenolol, Bisoprolol, Carvedilol, Doxazosin)",
  "style": "Funny",
  "mnemonics": [
    {
      "mnemonic": "Ateeq Bhai Car Dho Rahe the.",
      "mapping": "Maps to Atenolol, Bisoprolol, Carvedilol, Doxazosin."
    },
    ... (9 more mnemonics)
  ]
}

Respond ONLY with the structured JSON output.
`,
});


const mnemonicGeneratorFlow = ai.defineFlow(
  {
    name: 'mnemonicGeneratorFlow',
    inputSchema: MnemonicGeneratorInputSchema,
    outputSchema: MnemonicGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
