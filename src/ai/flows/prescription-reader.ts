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
    name: z.string().describe('The full name of the medication (generic name preferred).'),
    dosage: z.string().describe('The dosage and form of the medication (e.g., "500mg tablet", "250mg/5ml syrup").'),
    frequency: z.string().describe('How often to take the medication, standardized (e.g., "Twice daily", "At bedtime").'),
    route: z.string().describe('The route of administration (e.g., "Oral", "Topical", "IV").'),
    duration: z.string().describe('The duration of the therapy (e.g., "7 days", "2 weeks", "As needed").'),
    instructions: z.string().describe('Additional instructions for taking the medication (e.g., "With food", "For 7 days").'),
    status: z.enum(['confirmed', 'uncertain']).describe('Whether the recognition of this medication is certain or requires pharmacist review.'),
});

const ReadPrescriptionOutputSchema = z.object({
    patient_id: z.string().optional().describe("The patient's ID, if found on the prescription."),
    prescription_date: z.string().optional().describe("The date the prescription was written, in YYYY-MM-DD format if possible."),
    diagnosis: z.string().optional().describe("The doctor's diagnosis from the prescription."),
    medications: z.array(MedicationSchema).describe('A list of medications prescribed.'),
    summary: z.string().describe('A general summary of the prescription and any important notes for the pharmacist or patient.'),
});
export type ReadPrescriptionOutput = z.infer<typeof ReadPrescriptionOutputSchema>;

export async function readPrescription(input: ReadPrescriptionInput): Promise<ReadPrescriptionOutput> {
  return readPrescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'readPrescriptionPrompt',
  input: {schema: ReadPrescriptionInputSchema},
  output: {schema: ReadPrescriptionOutputSchema},
  prompt: `You are an expert AI medical assistant specializing in reading and interpreting handwritten or printed medical prescriptions. Your primary goal is accuracy and safety.

Analyze the following prescription image. Extract the information and convert it into the structured format defined by the output schema.

**Key Responsibilities:**
1.  **OCR and NLP**: Use your OCR and NLP capabilities to accurately read all text, including handwritten notes, typed text, and medical abbreviations.
2.  **Standardization**: Convert common medical shorthand into standardized terms. For example:
    - "BD" or "b.i.d." should become "Twice daily".
    - "HS" should become "At bedtime".
    - "PO" should become "Oral".
3.  **Extraction**: For each medication, extract all the required fields: name, dosage/strength, frequency, route, duration, and any special instructions.
4.  **Error Handling**: If you are uncertain about any part of a medication's details (e.g., the handwriting is illegible, the dosage is unclear), you MUST set the 'status' for that medication to "uncertain". For all other clearly identified medications, set 'status' to "confirmed".
5.  **Summarization**: Provide a concise summary of the overall prescription, highlighting any key information or areas that might need pharmacist attention.

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
