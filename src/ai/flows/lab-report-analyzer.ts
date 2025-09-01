
'use server';
/**
 * @fileOverview AI-powered lab report analyzer.
 *
 * - analyzeLabReport - A function that handles the lab report analysis.
 * - LabReportAnalyzerInput - The input type for the analyzeLabReport function.
 * - LabReportAnalyzerOutput - The return type for the analyzeLabReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const demographicsSchema = z.object({
    name: z.string().optional(),
    age: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    occupation: z.string().optional(),
    cnicOrPassport: z.string().optional(),
    address: z.string().optional(),
    hospitalId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }).optional();
  
  const detailedHistorySchema = z.object({
    demographics: demographicsSchema,
    presentingComplaint: z.string().optional(),
    historyOfPresentingIllness: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
    medicationHistory: z.string().optional(),
    allergyHistory: z.string().optional(),
    familyHistory: z.string().optional(),
    socialHistory: z.string().optional(),
    immunizationHistory: z.string().optional(),
    reviewOfSystems: z.string().optional(),
    lifestyleAndCompliance: z.string().optional(),
    ideasAndConcerns: z.string().optional(),
    pharmacistAssessment: z.string().optional(),
    carePlan: z.string().optional(),
  }).optional();


const LabReportAnalyzerInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the lab report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  detailedHistory: detailedHistorySchema.describe('Optional detailed patient history for context.'),
});
export type LabReportAnalyzerInput = z.infer<typeof LabReportAnalyzerInputSchema>;

const AnalyzedTestSchema = z.object({
    name: z.string().describe('The name of the lab test (e.g., "Hemoglobin", "Creatinine").'),
    value: z.string().describe('The patient\'s result for the test, including units.'),
    reference_range: z.string().describe('The normal reference range for the test.'),
    status: z.enum(['High', 'Normal', 'Low', 'Abnormal', 'Borderline']).describe('The status of the value (e.g., High, Normal, Low, Abnormal).'),
    layman_explanation: z.string().describe('A short, plain-language explanation for the patient.'),
    detailed_explanation: z.string().describe('A detailed medical explanation for a healthcare professional, including interpretation and potential significance.'),
});

const LabReportAnalyzerOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the lab findings, written in simple, understandable language.'),
  recommendations: z.string().describe('General, safe next-step recommendations for the patient (e.g., "Discuss these results with your doctor.").'),
  abnormalValues: z.array(AnalyzedTestSchema).describe('A list of all values that are outside the normal range.'),
  normalValues: z.array(AnalyzedTestSchema).describe('A list of all values that are within the normal range.'),
});
export type LabReportAnalyzerOutput = z.infer<typeof LabReportAnalyzerOutputSchema>;

export async function analyzeLabReport(input: LabReportAnalyzerInput): Promise<LabReportAnalyzerOutput> {
  return labReportAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'labReportAnalyzerPrompt',
  input: {schema: LabReportAnalyzerInputSchema},
  output: {schema: LabReportAnalyzerOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert clinical pathologist AI. Your task is to analyze the provided lab report image, interpret the results, and present them in a structured way for both patients and healthcare professionals.

**Analysis Steps:**
1.  **OCR & Extraction**: Read the lab report image and extract every test, including its name, the patient's value with units, and the reference range.
2.  **Categorization**: For each test, determine if the patient's value is 'High', 'Low', or 'Normal' compared to the reference range. Use 'Abnormal' for tests that are qualitative (e.g., Positive/Negative) and out of norm. Use 'Borderline' if a value is very close to the edge of the normal range.
3.  **Dual Interpretation**: For EVERY test (both normal and abnormal), you must generate two explanations:
    *   **layman_explanation**: A very simple, one-sentence explanation for a patient. For normal results, this should be reassuring. For abnormal results, it should be a simple statement of the finding (e.g., "Your Vitamin D is low, which might make you feel tired.").
    *   **detailed_explanation**: A more technical explanation for a healthcare professional. Include the value, range, and clinical context or potential implications.
4.  **Summarization**:
    *   Provide a high-level summary of the most important findings in easy-to-understand language.
    *   Provide general, safe recommendations for the patient, like "Please discuss these results with your doctor for a full evaluation and treatment plan." Do NOT suggest specific treatments.
5.  **Output Structure**: Populate the abnormalValues array with all tests that are NOT 'Normal'. Populate the normalValues array with all tests that ARE 'Normal'.

**Patient Context (Use for richer interpretation if available):**
- Past Medical History: {{detailedHistory.pastMedicalHistory}}
- Medication History: {{detailedHistory.medicationHistory}}

**Lab Report Image to Analyze:**
{{media url=photoDataUri}}

Respond in the structured JSON format defined by the output schema.
`,
});

const labReportAnalyzerFlow = ai.defineFlow(
  {
    name: 'labReportAnalyzerFlow',
    inputSchema: LabReportAnalyzerInputSchema,
    outputSchema: LabReportAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
