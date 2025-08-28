'use server';
/**
 * @fileOverview A general purpose chatbot.
 *
 * - mohsinChatbot - A function that handles the chatbot conversation.
 * - MohsinChatbotInput - The input type for the mohsinChatbot function.
 * - MohsinChatbotOutput - The return type for the mohsinChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z, generate} from 'genkit';

const historySchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const MohsinChatbotInputSchema = z.object({
  history: z.array(historySchema).describe('The chat history.'),
});
export type MohsinChatbotInput = z.infer<typeof MohsinChatbotInputSchema>;

const MohsinChatbotOutputSchema = z.string().describe('The chatbot response.');
export type MohsinChatbotOutput = z.infer<typeof MohsinChatbotOutputSchema>;

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
    const llmResponse = await generate({
      model: ai.model,
      prompt: {
        messages: [
          {
            role: 'system',
            content: `You are Mohsin's, a friendly and helpful AI assistant. Answer the user's questions as accurately as possible.`,
          },
          ...history,
        ],
      },
    });

    return llmResponse.text();
  }
);
