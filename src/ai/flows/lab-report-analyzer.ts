
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
  reportText: z.string().describe('The full text of the lab report.'),
  detailedHistory: detailedHistorySchema.describe('Optional detailed patient history for context.'),
});
export type LabReportAnalyzerInput = z.infer<typeof LabReportAnalyzerInputSchema>;

const LabReportAnalyzerOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the lab findings.'),
  abnormalValues: z.array(z.object({
    testName: z.string().describe('The name of the lab test (e.g., "Hemoglobin", "Creatinine").'),
    value: z.string().describe('The patient\'s result for the test.'),
    normalRange: z.string().describe('The normal reference range for the test.'),
    interpretation: z.string().describe('A brief interpretation of the abnormal value in the clinical context.'),
    severity: z.string().describe('The severity of the abnormality (e.g., "Mild", "Moderate", "Critical").'),
  })).describe('A list of all values that are outside the normal range.'),
  recommendations: z.string().describe('Clinical recommendations based on the findings, such as potential medication adjustments or follow-up tests.'),
});
export type LabReportAnalyzerOutput = z.infer<typeof LabReportAnalyzerOutputSchema>;

export async function analyzeLabReport(input: LabReportAnalyzerInput): Promise<LabReportAnalyzerOutput> {
  return labReportAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'labReportAnalyzerPrompt',
  input: {schema: LabReportAnalyzerInputSchema},
  output: {schema: LabReportAnalyzerOutputSchema},
  prompt: `You are an expert clinical pathologist and pharmacist.

  Analyze the provided lab report text in the context of the patient's history (if available).
  - Identify all values that are outside of their normal reference ranges.
  - For each abnormal value, provide the test name, the patient's value, the normal range, a clinical interpretation, and the severity.
  - Provide a concise overall summary of the findings.
  - Offer clear, actionable recommendations for the pharmacist, such as potential medication adjustments, dosage considerations, or suggested follow-up tests.

  ## Lab Report Text
  {{{reportText}}}

  {{#if detailedHistory}}
  ## Patient Context for Analysis
  - **Presenting Complaint**: {{detailedHistory.presentingComplaint}}
  - **Past Medical History**: {{detailedHistory.pastMedicalHistory}}
  - **Medication History**: {{detailedHistory.medicationHistory}}
  {{/if}}
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

