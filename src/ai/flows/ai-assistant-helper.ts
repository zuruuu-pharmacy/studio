
'use server';
/**
 * @fileOverview A general purpose AI assistant for pharmacy-related questions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistantHelperInputSchema = z.object({
  query: z.string().describe("The user's question or prompt."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
});
export type AssistantHelperInput = z.infer<typeof AssistantHelperInputSchema>;

const AssistantHelperOutputSchema = z.object({
  response: z.string().describe("The AI assistant's response."),
});
export type AssistantHelperOutput = z.infer<typeof AssistantHelperOutputSchema>;

export async function getAssistantResponse(input: AssistantHelperInput): Promise<AssistantHelperOutput> {
  return assistantHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantHelperPrompt',
  input: {schema: AssistantHelperInputSchema},
  output: {schema: AssistantHelperOutputSchema},
  prompt: `You are Zuruu, an AI Pharmacy Study Assistant, acting as a "Smart Search" engine for a student portal.

Your primary function is to take a user's query about any drug, disease, or medical topic and provide a comprehensive, reliable, and easy-to-understand answer. You must act as if you are searching across the entire portal's content (notes, textbooks, quizzes, etc.) to synthesize the best possible response.

**Key Instructions:**
1.  **Understand Natural Language:** The user might ask "What are the uses of digoxin?" or just type "digoxin uses". You must understand the intent and provide the relevant information.
2.  **Be Comprehensive:** For a drug, cover its class, mechanism of action (MOA), primary uses, and major side effects. For a disease, cover its pathophysiology, symptoms, and first-line treatments.
3.  **Be Clear & Concise:** Use student-friendly language. Structure your response with clear headings and bullet points for readability.
4.  **Prioritize Clinical Relevance:** For drug-related questions, always prioritize clinically significant information like common adverse effects, key monitoring parameters, and major contraindications.

**User's Search Query:**
{{{query}}}

**Your Comprehensive Answer:**
`,
});

const assistantHelperFlow = ai.defineFlow(
  {
    name: 'assistantHelperFlow',
    inputSchema: AssistantHelperInputSchema,
    outputSchema: AssistantHelperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
