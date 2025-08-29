
'use server';
/**
 * @fileOverview A general purpose AI assistant.
 *
 * - aiAssistant - A function that handles the conversational chat.
 * - AiAssistantInput - The input type for the aiAssistant function.
 * - AiAssistantOutput - The return type for the aiAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const historySchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export type AiAssistantInput = z.infer<typeof AiAssistantInputSchema>;
const AiAssistantInputSchema = z.object({
  history: z.array(historySchema).describe('The chat history.'),
});

export type AiAssistantOutput = z.infer<typeof AiAssistantOutputSchema>;
const AiAssistantOutputSchema = z.string().describe('The chatbot response.');

export async function aiAssistant(input: AiAssistantInput): Promise<AiAssistantOutput> {
  return aiAssistantFlow(input);
}

const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AiAssistantInputSchema,
    outputSchema: AiAssistantOutputSchema,
  },
  async ({history}) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-pro-latest',
      prompt: {
        messages: [
          {
            role: 'system',
            content: [{ text: `You are Zuruu AI Assistant, a friendly and helpful AI assistant. Answer the user's questions as accurately as possible.`}],
          },
          ...history.map(h => ({ role: h.role, content: [{ text: h.content }]})),
        ],
      },
    });

    return llmResponse.text;
  }
);
