
'use server';
/**
 * @fileOverview AI-powered adherence report generator.
 *
 * - generateAdherenceReport - A function that creates a weekly adherence report.
 * - AdherenceReportInput - The input type for the generateAdherenceReport function.
 * - AdherenceReportOutput - The return type for the generateAdherenceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationAdherenceSchema = z.object({
  medicineName: z.string().describe('The name of the medication.'),
  dosageStrength: z.string().describe('The dosage and form of the medication (e.g., "500mg tablet").'),
  frequency: z.string().describe('How often the medication is prescribed (e.g., "Twice daily").'),
  dosesPrescribed: z.coerce.number().int().describe('The total number of doses that should have been taken in the period.'),
  dosesTaken: z.coerce.number().int().describe('The total number of doses the patient actually took.'),
});

const AdherenceReportInputSchema = z.object({
  patientId: z.string().optional().describe('The patient\'s ID.'),
  weekStartDate: z.string().optional().describe('The start date of the reporting week (YYYY-MM-DD).'),
  medications: z.array(MedicationAdherenceSchema),
});
export type AdherenceReportInput = z.infer<typeof AdherenceReportInputSchema>;

const AdherenceReportOutputSchema = z.object({
  overallAdherence: z.string().describe('The overall adherence rate as a percentage for all medications.'),
  summaryNotes: z.string().describe('AI-generated summary and counseling notes for the patient or pharmacist. For each poorly maintained medication, explain why it was prescribed and the risks of not taking it.'),
  medications: z.array(z.object({
    medicineName: z.string(),
    dosageStrength: z.string(),
    dosesPrescribed: z.number().int(),
    dosesTaken: z.number().int(),
    dosesMissed: z.number().int(),
    adherenceRate: z.string().describe('The adherence rate for the individual medication as a percentage.'),
  })),
});
export type AdherenceReportOutput = z.infer<typeof AdherenceReportOutputSchema>;

export async function generateAdherenceReport(input: AdherenceReportInput): Promise<AdherenceReportOutput> {
  return adherenceReporterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adherenceReporterPrompt',
  input: {schema: AdherenceReportInputSchema},
  output: {schema: AdherenceReportOutputSchema},
  prompt: `You are an AI healthcare assistant specializing in medication adherence.

Analyze the provided medication and adherence data for a patient. Your task is to calculate adherence rates and provide a comprehensive report.

**Calculations:**
1.  For each medication, calculate 'dosesMissed' (dosesPrescribed - dosesTaken).
2.  For each medication, calculate the 'adherenceRate' as a percentage: (dosesTaken / dosesPrescribed) * 100. If dosesPrescribed is 0, the rate is 100%. Round to the nearest whole number and format as a string (e.g., "85%").
3.  Calculate the 'overallAdherence' rate for all medications combined. This should be the percentage of total doses taken out of total doses prescribed. If total prescribed is 0, it is 100%. Round and format as a string.
4.  Based on the adherence rates, generate a concise 'summaryNotes' section.
    - If overall adherence is good (>=80%), provide encouragement.
    - If overall adherence is poor (<80%), provide gentle counseling points. For each medication with an adherence rate below 80%, you MUST explain its importance: briefly state the likely reason the doctor prescribed it and describe the potential harms or health risks of not taking it as directed.

**Patient & Week Info (Optional):**
- Patient ID: {{{patientId}}}
- Week Start: {{{weekStartDate}}}

**Medication Data:**
{{#each medications}}
- Medicine: {{this.medicineName}} ({{this.dosageStrength}})
- Frequency: {{this.frequency}}
- Prescribed Doses: {{this.dosesPrescribed}}
- Doses Taken: {{this.dosesTaken}}
{{/each}}

Respond in the structured JSON format defined by AdherenceReportOutputSchema.
`,
});

const adherenceReporterFlow = ai.defineFlow(
  {
    name: 'adherenceReporterFlow',
    inputSchema: AdherenceReportInputSchema,
    outputSchema: AdherenceReportOutputSchema,
  },
  async input => {
    // The prompt is powerful enough to do the calculations, so no pre-processing needed here.
    const {output} = await prompt(input);
    return output!;
  }
);
