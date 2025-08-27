'use server';

/**
 * @fileOverview An AI-powered prescription reader.
 *
 * - readPrescription - A function that analyzes a prescription image.
 * - ReadPrescriptionInput - The input type for the readPrescription function.
 * - ReadPrescriptionOutput - The return type for the readPrescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReadPrescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ReadPrescriptionInput = z.infer<typeof ReadPrescriptionInputSchema>;

const MedicationSchema = z.object({
    name: z.string().describe('The name of the medication.'),
    dosage: z.string().describe('The dosage for the medication (e.g., "500mg").'),
    frequency: z.string().describe('How often to take the medication (e.g., "Twice a day").'),
    instructions: z.string().describe('Additional instructions for taking the medication (e.g., "With food", "For 7 days").'),
});

const ReadPrescriptionOutputSchema = z.object({
    diagnosis: z.string().optional().describe("The doctor's diagnosis from the prescription."),
    medications: z.array(MedicationSchema).describe('A list of medications prescribed.'),
    summary: z.string().describe('A general summary of the prescription and any important notes.'),
});
export type ReadPrescriptionOutput = z.infer<typeof ReadPrescriptionOutputSchema>;

export async function readPrescription(input: ReadPrescriptionInput): Promise<ReadPrescriptionOutput> {
  return readPrescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'readPrescriptionPrompt',
  input: {schema: ReadPrescriptionInputSchema},
  output: {schema: ReadPrescriptionOutputSchema},
  prompt: `You are an expert at reading and interpreting handwritten or printed medical prescriptions.

Analyze the following prescription image and extract the doctor's diagnosis, the list of medications with their dosages, frequency, and instructions.
Provide a clear summary of the prescription.

If any part of the prescription is unclear, make a best-effort interpretation and note that it was difficult to read.

Prescription Image: {{media url=photoDataUri}}
`,
});

const readPrescriptionFlow = ai.defineFlow(
  {
    name: 'readPrescriptionFlow',
    inputSchema: ReadPrescriptionInputSchema,
    outputSchema: ReadPrescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
