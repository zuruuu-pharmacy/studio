
'use server';
/**
 * @fileOverview AI-powered virtual OSCE station generator and evaluator.
 *
 * - generateOsceStation - A two-step flow to generate a case and evaluate student answers.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// STEP 1: Case Generation
const PatientCaseSchema = z.object({
    demographics: z.string().describe('Patient demographics (age, gender, lifestyle).'),
    chiefComplaint: z.string().describe('The main reason for the visit.'),
    hpi: z.string().describe('History of Present Illness.'),
    pmh: z.string().describe('Past Medical & Family History.'),
    medications: z.string().describe('Current Medications & Allergies.'),
    examination: z.string().describe('Physical Examination Findings.'),
    labs: z.string().describe('Lab & Diagnostic Reports.'),
});

const ClinicalQuestionSchema = z.object({
    question: z.string().describe('A clinical question related to the case.'),
    type: z.enum(['text', 'multiple_choice']).default('text').describe('The type of answer expected.'),
    options: z.array(z.string()).optional().describe('Options for multiple-choice questions.'),
});

const CaseGenerationOutputSchema = z.object({
    caseDetails: PatientCaseSchema,
    questions: z.array(ClinicalQuestionSchema),
});

// STEP 2: Feedback Generation
const StudentAnswerSchema = z.object({
    question: z.string(),
    answer: z.string(),
});

const FeedbackSchema = z.object({
    diagnosisConfirmation: z.string().describe("Confirmation of the most likely diagnosis."),
    drugChoiceRationale: z.string().describe("Rationale for the best drug choices and why others are less suitable."),
    monitoringPlan: z.string().describe("Suggested monitoring parameters."),
    lifestyleCounseling: z.string().describe("Key lifestyle modification counseling points."),
    overallFeedback: z.string().describe("A summary of the student's performance and key learning points based on OSCE criteria like communication, clinical judgment, and safety."),
});

// Main Flow Input/Output
const OsceStationGeneratorInputSchema = z.object({
  topic: z.string().describe('The medical topic or OSCE domain for the station (e.g., "Patient Counseling for Inhalers", "Pediatric Dosage Calculation").'),
  studentAnswers: z.array(StudentAnswerSchema).optional().describe("The student's answers to the questions."),
  caseDetails: PatientCaseSchema.optional().describe('The original case details (for step 2).'),
});
export type OsceStationGeneratorInput = z.infer<typeof OsceStationGeneratorInputSchema>;

const OsceStationGeneratorOutputSchema = z.object({
    // Step 1 Output
    caseDetails: PatientCaseSchema.optional(),
    questions: z.array(ClinicalQuestionSchema).optional(),
    // Step 2 Output
    feedback: FeedbackSchema.optional(),
});
export type OsceStationGeneratorOutput = z.infer<typeof OsceStationGeneratorOutputSchema>;


export async function generateOsceStation(input: OsceStationGeneratorInput): Promise<OsceStationGeneratorOutput> {
  return osceStationGeneratorFlow(input);
}


// Prompt for Step 1: Case Generation
const caseGenerationPrompt = ai.definePrompt({
  name: 'osceStationGenerationPrompt',
  input: {schema: z.object({ topic: z.string() })},
  output: {schema: CaseGenerationOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an OSCE/Viva Examiner Simulator for pharmacy students.
  Your role is to create a station that assesses communication, clinical judgment, calculation accuracy, and prescription safety.

  **Topic/Domain:** {{{topic}}}

  **Instructions:**
  1.  Create a detailed patient case with all the required sections: Demographics, Chief Complaint, HPI, PMH, Medications, Examination, and Labs. The case should be tailored to the OSCE topic.
  2.  Generate 4-5 relevant clinical questions that test diagnosis, drug selection, patient counseling, calculations, or other relevant skills based on the topic. Make at least one question multiple-choice.
  3.  The case should be classic but have a nuance that requires critical thinking and aligns with OSCE testing principles.

  Respond ONLY with the structured JSON output.
  `,
});

// Prompt for Step 2: Feedback Generation
const feedbackGenerationPrompt = ai.definePrompt({
  name: 'osceFeedbackGenerationPrompt',
  input: {schema: OsceStationGeneratorInputSchema},
  output: {schema: z.object({ feedback: FeedbackSchema })},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an OSCE/Viva Examiner Simulator for pharmacy students.
  A pharmacy student has submitted their answers for a station.
  Your behavior should be professional and neutral, providing structured feedback.
  Your primary outcomes for assessment are: communication, clinical judgment, calculation accuracy, and prescription safety.

  **Case Details:**
  -   **Demographics:** {{caseDetails.demographics}}
  -   **Complaint:** {{caseDetails.chiefComplaint}}
  -   **HPI:** {{caseDetails.hpi}}
  -   **PMH:** {{caseDetails.pmh}}
  -   **Medications:** {{caseDetails.medications}}
  -   **Examination:** {{caseDetails.examination}}
  -   **Labs:** {{caseDetails.labs}}

  **Student's Answers:**
  {{#each studentAnswers}}
  -   **Q:** {{this.question}}
  -   **A:** {{this.answer}}
  {{/each}}

  **Your Task (as an Examiner):**
  1.  **Diagnosis:** Confirm the most likely diagnosis and any differential diagnoses.
  2.  **Drug Choice & Rationale:** Evaluate the student's drug choice. Explain the best evidence-based options, why they are suitable, and why other choices are unsafe or less effective.
  3.  **Monitoring Plan:** Outline essential monitoring parameters (e.g., BP, glucose, electrolytes).
  4.  **Counseling Points:** Provide key lifestyle, adherence, and device counseling points if applicable.
  5.  **Overall Feedback:** Give a summary of what the student did well and what they missed, focusing on clinical judgment, communication, safety, and accuracy.

  Be encouraging but professional. Focus on clinical reasoning. Respond ONLY with the structured JSON output.
  `,
});


const osceStationGeneratorFlow = ai.defineFlow(
  {
    name: 'osceStationGeneratorFlow',
    inputSchema: OsceStationGeneratorInputSchema,
    outputSchema: OsceStationGeneratorOutputSchema,
  },
  async (input) => {
    // If we have answers, this is the second step (Feedback).
    if (input.studentAnswers && input.studentAnswers.length > 0) {
      const { output } = await feedbackGenerationPrompt(input);
      return output!;
    } else {
      // Otherwise, this is the first step (Case Generation).
      const { output } = await caseGenerationPrompt({ topic: input.topic });
      return output!;
    }
  }
);
