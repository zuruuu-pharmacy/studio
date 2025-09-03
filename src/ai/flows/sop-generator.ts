
'use server';
/**
 * @fileOverview AI-powered Standard Operating Procedure (SOP) generator for pharmacy labs.
 *
 * - generateSop - A function that creates a comprehensive SOP for a given experiment.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the detailed input schema
const SopGeneratorInputSchema = z.object({
  experimentTitle: z.string().describe("The title of the lab experiment for which to generate the SOP."),
});
export type SopGeneratorInput = z.infer<typeof SopGeneratorInputSchema>;

// Define the detailed output schema matching the user's specification
const SopGeneratorOutputSchema = z.object({
  title: z.string().describe("The official title of the experiment."),
  objectives: z.array(z.string()).describe("A list of clear learning objectives."),
  theory: z.string().describe("A concise explanation of the experiment's principle, mechanism, and relevance."),
  requirements: z.object({
    reagents: z.array(z.string()).describe("List of all reagents, chemicals, and drugs with concentrations."),
    instruments: z.array(z.string()).describe("List of all required instruments and glassware."),
    consumables: z.array(z.string()).describe("List of consumables like gloves, tips, etc."),
    special: z.string().optional().describe("Special requirements like animal models or biosafety cabinets, including ethical notes."),
  }),
  procedure: z.array(z.string()).describe("A numbered, step-by-step procedure for the experiment."),
  observationGuidelines: z.string().describe("What the student should observe and how to record it, including sample table formats."),
  resultAndInterpretation: z.string().describe("How to state the result and interpret the expected outcomes, including error analysis."),
  safetyPrecautions: z.string().describe("A summary of lab-specific hazards, waste disposal, and emergency steps."),
  diagramUrl: z.string().optional().describe("A URL to a generated diagram or a simple text-based flowchart."),
  vivaVoce: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).describe("A list of 5-10 viva-voce questions with their suggested answers."),
  commonErrors: z.string().describe("A list of common errors students make and how to troubleshoot them."),
  virtualLabSimulation: z.string().describe("A narrative for a step-by-step virtual simulation of the experiment."),
  labReportTemplate: z.string().describe("A simple template structure for the student's lab report."),
  complianceNotes: z.string().describe("Notes on relevance to GLP, GMP, CPCSEA, or Biosafety levels."),
});
export type SopGeneratorOutput = z.infer<typeof SopGeneratorOutputSchema>;

export async function generateSop(input: SopGeneratorInput): Promise<SopGeneratorOutput> {
  return sopGeneratorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'sopGeneratorPrompt',
  input: {schema: SopGeneratorInputSchema},
  output: {schema: SopGeneratorOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a Pharmacy Laboratory Knowledge Generator AI. Your task is to create a complete, academically accurate, and exam-ready Standard Operating Procedure (SOP) for the given experiment title.

**Experiment Title:** {{{experimentTitle}}}

**Instructions:**
Generate a comprehensive SOP adhering to the following structure. Be detailed, precise, and use standard scientific language suitable for university-level pharmacy students.

1.  **Title:** State the full, standard title of the experiment.
2.  **Objectives:** List the key learning outcomes as bullet points.
3.  **Theory/Background:** Provide a detailed explanation of the underlying principles, mechanisms, and clinical/industrial relevance.
4.  **Requirements/Materials:**
    -   **Reagents:** List all chemicals, drugs, and reagents with their required concentrations.
    -   **Instruments:** List all necessary instruments, glassware, and equipment.
    -   **Consumables:** List disposable items needed.
    -   **Special:** Note any special requirements like animal models (and mention CPCSEA ethical guidelines) or specific biosafety levels.
5.  **Step-by-Step Procedure:** Provide a clear, numbered list of steps from preparation to execution to recording.
6.  **Observation Guidelines:** Describe what to observe and how. Include a markdown table format for recording results.
7.  **Result & Interpretation:** Explain how to format the result and what the expected outcome means. Discuss potential sources of error.
8.  **Safety Precautions:** Detail specific chemical, biological, or physical hazards and waste disposal protocols.
9.  **Diagram/Flowchart:** Provide a simple text-based flowchart if a diagram is not possible.
10. **Viva-Voce Questions:** Generate at least 5 relevant viva questions covering theory, procedure, and interpretation, along with their correct, concise answers.
11. **Common Errors/Troubleshooting:** List typical mistakes and how to avoid them.
12. **Virtual Lab Simulation:** Write a short, step-by-step narrative describing the expected observations as if the student were performing the experiment in a virtual lab.
13. **Lab Report Template:** Outline a simple structure for the student's lab report.
14. **Regulatory & Compliance Notes:** Mention any connections to GLP, GMP, CPCSEA, or biosafety guidelines.

Respond ONLY with the structured JSON output as defined by the schema.
`,
});


const sopGeneratorFlow = ai.defineFlow(
  {
    name: 'sopGeneratorFlow',
    inputSchema: SopGeneratorInputSchema,
    outputSchema: SopGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
