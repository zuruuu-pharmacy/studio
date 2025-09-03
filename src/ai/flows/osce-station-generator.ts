
'use server';
/**
 * @fileOverview AI-powered virtual OSCE station generator and evaluator.
 *
 * - generateOsceStation - A multi-step flow to generate a case, evaluate answers, and provide practice feedback.
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
    question: z.string().describe('A clinical question related to the case or topic.'),
    type: z.enum(['text', 'multiple_choice']).default('text').describe('The type of answer expected.'),
    options: z.array(z.string()).optional().describe('Options for multiple-choice questions.'),
});

const CaseGenerationOutputSchema = z.object({
    caseDetails: PatientCaseSchema,
    questions: z.array(ClinicalQuestionSchema),
});

// STEP 2: Exam Feedback Generation
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
    scoring: z.object({
        communication: z.number().optional().describe("Score for Communication (out of 5). Set to null if not applicable."),
        clinicalReasoning: z.number().optional().describe("Score for Clinical Reasoning (out of 5). Set to null if not applicable."),
        calculationAccuracy: z.number().optional().describe("Score for Calculation Accuracy (out of 5). Set to null if not applicable."),
        safetyAndInteractions: z.number().optional().describe("Score for Safety & Interactions (out of 5). Set to null if not applicable."),
        structureAndTimeManagement: z.number().optional().describe("Score for Structure & Time Management (out of 5). Set to null if not applicable."),
        criticalErrors: z.array(z.string()).optional().describe("A list of any critical errors made by the student."),
    }).describe("A detailed scoring rubric based on performance."),
});

// STEP 3: Practice (Instant) Feedback
const InstantFeedbackSchema = z.object({
    strengths: z.string().describe("Positive feedback on what the student did well in their answer."),
    priorityFix: z.string().describe("The single most important correction or improvement for the student's answer."),
    safeAlternative: z.string().optional().describe("A suggestion for a safer or more effective alternative phrasing or action."),
});


// Main Flow Input/Output
const OsceStationGeneratorInputSchema = z.object({
  topic: z.string().describe('The medical topic or OSCE domain for the station (e.g., "Patient Counseling for Inhalers", "Pediatric Dosage Calculation").'),
  
  // For exam mode (all answers at once)
  studentAnswers: z.array(StudentAnswerSchema).optional().describe("The student's answers to the questions for final exam-style feedback."),

  // For practice mode (one answer at a time)
  practiceAnswer: StudentAnswerSchema.optional().describe("A single answer for instant practice feedback."),
  
  caseDetails: PatientCaseSchema.optional().describe('The original case details (for step 2 & 3).'),
});
export type OsceStationGeneratorInput = z.infer<typeof OsceStationGeneratorInputSchema>;

const OsceStationGeneratorOutputSchema = z.object({
    // Step 1 Output
    caseDetails: PatientCaseSchema.optional(),
    questions: z.array(ClinicalQuestionSchema).optional(),
    // Step 2 (Exam) Output
    feedback: FeedbackSchema.optional(),
    // Step 3 (Practice) Output
    instantFeedback: InstantFeedbackSchema.optional(),
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
  1.  Create a detailed Candidate Brief (what the student sees) and a Data Pack (vitals, labs, etc.). This information should be comprehensive and form the basis of the 'caseDetails' object.
  2.  If the topic is "Drill questions for:...", generate a series of 8-10 short, distinct questions on that topic instead of a full case study. For the 'caseDetails' object, you MUST populate its fields with placeholder text like "N/A for Drill Mode" or similar.
  3.  Generate 4-5 relevant clinical questions that represent the Examiner Script. These should test diagnosis, drug selection, patient counseling, calculations, or other relevant skills based on the topic. Make at least one question multiple-choice.
  4.  The case should be classic but have a nuance that requires critical thinking and aligns with OSCE testing principles.

  Respond ONLY with the structured JSON output.
  `,
});

// Prompt for Step 2: Feedback Generation (Exam Mode)
const examFeedbackGenerationPrompt = ai.definePrompt({
  name: 'osceExamFeedbackGenerationPrompt',
  input: {schema: OsceStationGeneratorInputSchema},
  output: {schema: z.object({ feedback: FeedbackSchema })},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an OSCE/Viva Examiner Simulator for pharmacy students.
  A pharmacy student has submitted their answers for a station in EXAM mode.
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
  1.  **Analyze & Score:** Critically evaluate the student's answers against the case. Based on this, provide a score from 0-5 for each of the following domains. If a domain is not applicable (e.g., no calculations), set its score to null.
      -   **communication:** How well did they communicate? (Clarity, empathy, structure)
      -   **clinicalReasoning:** How sound was their clinical judgment?
      -   **calculationAccuracy:** If applicable, was their calculation correct?
      -   **safetyAndInteractions:** Did they identify and manage safety risks?
      -   **structureAndTimeManagement:** Was their approach logical and efficient?
  2.  **Identify Critical Errors:** Check for any of the following critical errors. If found, add a description to the 'criticalErrors' array.
      -   “Unsafe advice causing potential harm”
      -   “Missed life-threatening red flag”
      -   “Calculation error >10%”
  3.  **Provide Qualitative Feedback:**
      -   **Diagnosis:** Confirm the most likely diagnosis.
      -   **Drug Choice & Rationale:** Evaluate the student's drug choice and explain the best options.
      -   **Monitoring Plan:** Outline essential monitoring parameters.
      -   **Counseling Points:** Provide key counseling points.
      -   **Overall Feedback:** Give a summary of performance, linking back to the scoring domains.

  Be encouraging but professional. Focus on clinical reasoning. Respond ONLY with the structured JSON output.
  `,
});


// Prompt for Step 3: Instant Feedback (Practice / Drill Mode)
const practiceFeedbackPrompt = ai.definePrompt({
  name: 'oscePracticeFeedbackPrompt',
  input: {schema: OsceStationGeneratorInputSchema},
  output: {schema: z.object({ instantFeedback: InstantFeedbackSchema })},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an OSCE/Viva Examiner Simulator in PRACTICE mode. A student has just submitted their answer for a single question. Provide immediate, targeted feedback.

  **Case Context:**
  -   **Complaint:** {{caseDetails.chiefComplaint}}
  -   **HPI:** {{caseDetails.hpi}}
  -   **PMH:** {{caseDetails.pmh}}
  -   **Medications:** {{caseDetails.medications}}

  **The Question:**
  "{{practiceAnswer.question}}"

  **The Student's Answer:**
  "{{practiceAnswer.answer}}"

  **Your Task:**
  Provide concise, instant feedback based on the "FBK.INSTANT.001" template:
  1.  **Strengths:** In one sentence, what did the student do well? (e.g., "You correctly identified the need to check for allergies.")
  2.  **Priority Fix:** What is the single most important thing they should correct or add? Be specific. (e.g., "You should also ask about the type of reaction the patient had to Penicillin.")
  3.  **Safe Alternative:** If applicable, suggest a better way to phrase their response or a safer action. (e.g., "A better way to ask would be, 'Can you describe what happened when you took Penicillin?'")

  Be encouraging and focus on helping the student improve for the next question. Respond ONLY with the structured JSON output.
  `,
});


const osceStationGeneratorFlow = ai.defineFlow(
  {
    name: 'osceStationGeneratorFlow',
    inputSchema: OsceStationGeneratorInputSchema,
    outputSchema: OsceStationGeneratorOutputSchema,
  },
  async (input) => {
    // Mode 3: Practice or Drill Mode (Instant Feedback)
    if (input.practiceAnswer) {
        const { output } = await practiceFeedbackPrompt(input);
        return output!;
    }
    // Mode 2: Exam Mode (Full Feedback)
    else if (input.studentAnswers && input.studentAnswers.length > 0) {
      const { output } = await examFeedbackGenerationPrompt(input);
      return output!;
    } 
    // Mode 1: Case Generation
    else {
      const { output } = await caseGenerationPrompt({ topic: input.topic });
      return output!;
    }
  }
);
