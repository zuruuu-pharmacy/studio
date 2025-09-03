
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
    hint: z.string().optional().describe("A subtle hint for the student if they get stuck in practice mode."),
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
    modelAnswer: z.string().describe("An exemplar, bullet-point model answer showing how an expert would have handled the station's core tasks."),
    scoring: z.object({
        communication: z.number().nullable().describe("Score for Communication (out of 5). Set to null if not applicable."),
        clinicalReasoning: z.number().nullable().describe("Score for Clinical Reasoning (out of 5). Set to null if not applicable."),
        calculationAccuracy: z.number().nullable().describe("Score for Calculation Accuracy (out of 5). Set to null if not applicable."),
        safetyAndInteractions: z.number().nullable().describe("Score for Safety & Interactions (out of 5). Set to null if not applicable."),
        structureAndTimeManagement: z.number().nullable().describe("Score for Structure & Time Management (out of 5). Set to null if not applicable."),
        criticalErrors: z.array(z.string()).optional().describe("A list of any critical errors made by the student."),
    }).describe("A detailed scoring rubric based on performance."),
});

// STEP 3: Practice (Instant) Feedback
const InstantFeedbackSchema = z.object({
    strengths: z.string().describe("Positive feedback on what the student did well in their answer."),
    priorityFix: z.string().describe("The single most important correction or improvement for the student's answer."),
    safeAlternative: z.string().optional().describe("A suggestion for a safer or more effective phrasing or action."),
});


// Main Flow Input/Output
const OsceStationGeneratorInputSchema = z.object({
  topic: z.string().describe('The medical topic or OSCE domain for the station (e.g., "Patient Counseling for Inhalers", "Pediatric Dosage Calculation"). This may include a difficulty tier.'),
  
  // For exam mode (all answers at once)
  studentAnswers: z.array(StudentAnswerSchema).optional().describe("The student's answers to the questions for final exam-style feedback."),

  // For practice mode (one answer at a time)
  practiceAnswer: StudentAnswerSchema.optional().describe("A single answer for instant practice feedback."),
  
  caseDetails: PatientCaseSchema.optional().describe('The original case details (for step 2 & 3).'),
  questions: z.array(ClinicalQuestionSchema).optional().describe('The original questions (for step 2 & 3).'),
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
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are an OSCE/Viva Examiner Simulator for pharmacy students. Your behavior MUST be neutral, succinct, and non-leading. Your primary role is to create a station that assesses communication, clinical judgment, calculation accuracy, and prescription safety, structured according to professional standards.

  **Topic/Domain:** {{{topic}}}

  **Output Blueprints:**
  - OUT.CANDIDATE.BRIEF & OUT.DATA.PACK: These combine to form the 'caseDetails' object. This is what the student sees.
  - OUT.EXAMINER.SCRIPT: This is the 'questions' array, a series of progressive prompts.
  - OUT.MARKING.SHEET & OUT.FEEDBACK: These are handled in the feedback generation step.

  **Exemplars (Follow these patterns):**
  - **EXMPL.001 — Patient Counseling (Inhaler):**
    - BRIEF: “Teach a 24-year-old with new asthma how to use a salbutamol MDI with spacer; address adherence and trigger avoidance; 7 minutes.”
    - DATA PACK: “Peak flow low; Rx: Salbutamol MDI PRN, Beclomethasone BID.”
    - SCRIPT: “Open → ICE → Demonstration request → Check-back → Safety-net → Adherence strategy.”
  - **EXMPL.002 — Dosage Calculation (Pediatrics):**
    - BRIEF: “Calculate amoxicillin dose (mg) and volume (mL) for 18 kg child with otitis media (45 mg/kg/day in 2 divided doses), suspension 250 mg/5 mL.”
    - SCRIPT: Must prompt for method, require unit trail, and include a plausibility check.
  - **EXMPL.003 — Prescription Screening (Warfarin + TMP-SMX):**
    - TASK: Identify interaction, propose plan (avoid or monitor INR + gastroprotection), counsel bleeding signs.
  - **EXMPL.004 — Drug Information Query (Pregnancy):**
    - QUESTION: “Is nitrofurantoin safe in 1st trimester UTI?”
    - SCRIPT: Elicit concise answer → trimester nuance → alternatives → monitoring → references.

  **Instructions:**
  1.  **Analyze Topic & Difficulty:** Parse the topic, which may include a difficulty tier like "Tier-1", "Tier-2", or "Tier-3". You MUST generate a case that matches this difficulty level.
      - **Tier-1 (Foundations):** Focus on common OTC, simple calculations, basic counseling.
      - **Tier-2 (Core):** Focus on topics like antibiotic stewardship, insulin titration, inhaler technique + spacer.
      - **Tier-3 (Advanced):** Focus on complex topics like anticoagulation bridging, renal dosing, polypharmacy/interactions, oncology safe handling.
  2.  **Use Variation Engine:** To ensure realism and diversity, you MUST introduce variability into each scenario.
      - **VAR.001 (Demographics):** Rotate patient factors like age, comorbidities (e.g., CKD, liver disease), or special conditions (e.g., pregnancy).
      - **VAR.002 (Setting):** Rotate the clinical setting (community pharmacy, hospital ward, discharge counseling, telehealth).
      - **VAR.003 (Data Noise):** Include some non-critical or distracting information in the data pack to test the student's ability to prioritize.
      - **VAR.004 (Curveball):** Occasionally (not always), introduce a mid-station complication or new piece of information into the examiner script (e.g., a question like "The patient now mentions they are allergic to... how does that change your plan?").
  3.  **Embed Cultural Competence:** When generating scenarios, you MUST consider cultural competence. This includes sensitivity to language choices, patient beliefs, and socioeconomic factors that may arise from the rotated demographics and settings.
  4.  **Create Case Materials (Candidate Brief & Data Pack):** Generate a detailed Candidate Brief (what the student sees) and a Data Pack (vitals, labs, Rx, devices, leaflets). This information should be comprehensive and form the basis of the 'caseDetails' object.
  5.  **Handle Drill Mode:** If the topic starts with "Drill questions for:", you MUST generate a series of 8-10 short, distinct questions on that topic instead of a full case study. For the 'caseDetails' object, you MUST populate its fields with the text "N/A for Drill Mode".
  6.  **Generate Examiner Script (Progressive & Structured Prompts):** Create 4-5 relevant clinical questions. These questions must be structured as progressive prompts that follow a logical flow where each question logically follows the previous one, probing deeper into the student's understanding.
      - **Start with Openers (QLG.001):** Begin with open-ended questions (e.g., "What are your initial thoughts?", "What are the key issues here?").
      - **Narrow with Focused Questions (QLG.002):** Follow up with focused questions about safety, red flags, or specific details.
      - **For counseling stations (QLG.004):** you MUST include a question that prompts a "teach-back" to check for understanding.
      - **For calculation stations (CALC Guardrails):** you MUST include questions that act as safety guardrails: prompt the student to show their work or explain their method (CALC.002), state the final units (CALC.001), and confirm the final dose and route (CALC.004).
      - **For prescription screening stations (RX SAFETY GRID):** you MUST include questions covering the RX SAFETY GRID: patient identifiers (RX.001), drug clarity (RX.002), indication (RX.003), contraindications (RX.004), interactions (RX.005), and monitoring plans (RX.006).
      - **For Drug Information Query stations (DI RESPONSE MAP):** you MUST structure questions to first elicit a concise one-liner answer (DI.001), then expand on details like MOA/PK (DI.002), then ask how to handle uncertainty (DI.003), and finally, safety-netting (DI.004).
      - **End with a summary or safety-netting question (QLG.003)** (e.g., "What would you do next?", "What are the most important things to tell the patient?").
  7.  **Generate Hints:** For each question, provide a subtle, one-sentence hint that aligns with the HINT categories (Concept, Process, Safety, Calculation). The hint should nudge the student without giving away the answer (e.g., "Consider the patient's renal function," or "How would you explain this to the patient?").
  8.  **Align with OSCE Principles:** The case should be classic but have a nuance that requires critical thinking and aligns with OSCE testing principles.
  9.  **Uphold Professionalism & Ethics:**
      -   **ETH.001:** Your persona is that of a professional examiner. Maintain strict professional boundaries and do not provide clinical advice outside the scope of the simulation.
      -   **ETH.002:** When designing the script, especially for DI queries, you MUST include prompts that guide the student toward proper safety-netting and knowing when to refer or consult senior practitioners.
      -   **ETH.003:** In the case materials (the 'demographics' or 'hpi' fields), you can include a brief, realistic note like "Patient has provided consent for this consultation for training purposes." or "Information is for educational use only." to reinforce the concept of confidentiality.
  10. **Implement Safety Guardrails (CONTENT GUARDS):**
      - **SAFE.002:** If the case contains life-threatening red flags (e.g., signs of anaphylaxis, critical lab values), you MUST include a prompt in the examiner script that tests if the student recognizes the urgency and escalates appropriately.
      - **SAFE.003:** The script must include a prompt to ask for referral criteria or next steps when there is clinical ambiguity or if the situation is beyond the scope of a pharmacist's independent practice.

  Respond ONLY with the structured JSON output.
  `,
});

// Prompt for Step 2: Feedback Generation (Exam Mode)
const examFeedbackGenerationPrompt = ai.definePrompt({
  name: 'osceExamFeedbackGenerationPrompt',
  input: {schema: OsceStationGeneratorInputSchema},
  output: {schema: z.object({ feedback: FeedbackSchema })},
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are an OSCE/Viva Examiner Simulator for pharmacy students. A pharmacy student has submitted their answers for a station in EXAM mode.
  Your behavior MUST be professional, neutral, succinct, and non-leading, providing structured feedback. Your primary outcomes for assessment are: communication, clinical judgment, calculation accuracy, and prescription safety.

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
  1.  **CRITICAL RULE: Check for Empty Submission:** First, check if all 'answer' fields from the student are empty or contain only whitespace.
      - **If true:** You MUST assign a score of 0 for all scoring domains where a score is possible (clinicalReasoning, safetyAndInteractions, structureAndTimeManagement). Communication MUST be null. Calculation accuracy MUST be null unless a calculation was explicitly asked for and left blank, in which case it is 0. For all qualitative feedback fields ('overallFeedback', 'diagnosisConfirmation', etc.), you MUST state "No answer provided." or "Station left blank.". Do not generate any other feedback.
      - **If at least one answer has content:** Proceed with the full evaluation below.
  2.  **Analyze & Score (Rule of Evidence):** Critically evaluate the student's answers against the case. For each scoring domain below, you must find positive evidence in the answers to award points. **If you cannot find any evidence for a specific domain, you MUST assign a score of 0 for that domain.** A score of null is only for non-applicable domains (e.g., no calculations in the case).
      -   **communication:** How well did they communicate? (Clarity, empathy, structure)
      -   **clinicalReasoning:** How sound was their clinical judgment?
      -   **calculationAccuracy:** If applicable, was their calculation correct?
      -   **safetyAndInteractions:** Did they identify and manage safety risks?
      -   **structureAndTimeManagement:** Was their approach logical and efficient?
  3.  **Identify Critical Errors:** Check for any of the following critical errors. If found, add a description to the 'criticalErrors' array.
      -   “Unsafe advice causing potential harm”
      -   “Missed life-threatening red flag”
      -   “Calculation error >10%”
      -   “Failed to identify a major contraindication or interaction.”
  4.  **Provide Qualitative Feedback:**
      -   **Diagnosis:** Confirm the most likely diagnosis.
      -   **Drug Choice & Rationale:** Evaluate the student's drug choice and explain the best options.
      -   **Monitoring Plan:** Outline essential monitoring parameters.
      -   **Counseling Points:** Provide key counseling points.
      -   **Overall Feedback:** Give a summary of performance, linking back to the scoring domains.
  5.  **Generate Model Answer:** Provide a concise, bullet-pointed model answer that outlines how an expert or ideal candidate would have responded to the core tasks of the station. This should be a guide for the student to compare their performance against.

  Be professional, specific, action-oriented, and exam-aligned. Respond ONLY with the structured JSON output.
  `,
});


// Prompt for Step 3: Instant Feedback (Practice / Drill Mode)
const practiceFeedbackPrompt = ai.definePrompt({
  name: 'oscePracticeFeedbackPrompt',
  input: {schema: OsceStationGeneratorInputSchema},
  output: {schema: z.object({ instantFeedback: InstantFeedbackSchema })},
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are an OSCE/Viva Examiner Simulator in PRACTICE mode. A student has just submitted their answer for a single question. Provide immediate, targeted feedback. Your feedback must be professional, specific, action-oriented, neutral, and non-leading.

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
  Provide concise, instant feedback using the "FBK.INSTANT.001" template:
  1.  **Strengths:** In one sentence, what did the student do well? (e.g., "You correctly identified the need to check for allergies.")
  2.  **Priority Fix:** What is the single most important thing they should correct or add? Be specific. (e.g., "You should also ask about the type of reaction the patient had to Penicillin.")
  3.  **Safe Alternative:** If applicable, suggest a better way to phrase their response or a safer action. (e.g., "A better way to ask would be, 'Can you describe what happened when you took Penicillin?'")
  4.  **Content Guard Check (SAFE.001):** If the student's answer contains a clearly unsafe suggestion (e.g., a dangerously incorrect dose), your **Priority Fix** MUST be a red alert that halts the interaction and explains the danger. Example: "STOP. This dose is ten times the recommended maximum and could be fatal. You must always double-check pediatric calculations."

  Be encouraging but professional and exam-aligned. Do not give away answers to upcoming questions. Respond ONLY with the structured JSON output.
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
        // We also need to return the original case details and questions to maintain state on the client
        return { 
            ...output,
            caseDetails: input.caseDetails,
            questions: input.questions,
        };
    }
    // Mode 2: Exam Mode (Full Feedback)
    else if (input.studentAnswers && input.studentAnswers.length > 0) {
      const { output } = await examFeedbackGenerationPrompt(input);
      // Combine the feedback with the original case details and questions for a complete output
      return { 
          feedback: output!.feedback,
          caseDetails: input.caseDetails,
          questions: input.questions,
      };
    } 
    // Mode 1: Case Generation
    else {
      const { output } = await caseGenerationPrompt({ topic: input.topic });
      return output!;
    }
  }
);
