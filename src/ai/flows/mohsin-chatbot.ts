'use server';
/**
 * @fileOverview A general purpose chatbot.
 *
 * - mohsinChatbot - A function that handles the chatbot conversation.
 * - MohsinChatbotInput - The input type for the mohsinChatbot function.
 * - MohsinChatbotOutput - The return type for the mohsinChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const historySchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export type MohsinChatbotInput = z.infer<typeof MohsinChatbotInputSchema>;
const MohsinChatbotInputSchema = z.object({
  history: z.array(historySchema).describe('The chat history.'),
});

export type MohsinChatbotOutput = z.infer<typeof MohsinChatbotOutputSchema>;
const MohsinChatbotOutputSchema = z.string().describe('The chatbot response.');

export async function mohsinChatbot(input: MohsinChatbotInput): Promise<MohsinChatbotOutput> {
  return mohsinChatbotFlow(input);
}

const mohsinChatbotFlow = ai.defineFlow(
  {
    name: 'mohsinChatbotFlow',
    inputSchema: MohsinChatbotInputSchema,
    outputSchema: MohsinChatbotOutputSchema,
  },
  async ({history}) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: {
        messages: [
          {
            role: 'system',
            content: `You are Zuruu AI Assistant, a friendly and helpful AI assistant. Answer the user's questions as accurately as possible.`,
          },
          ...history,
        ],
      },
    });

    return llmResponse.text;
  }
);
