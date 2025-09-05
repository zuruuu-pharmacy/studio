
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
  prompt: `You are a helpful AI assistant for pharmacy students and professionals. Your name is Zuruu.
  Answer the user's question based on the context of the conversation history.
  Keep your answers concise and informative.

  {{#if history}}
  Conversation History:
  {{#each history}}
  - {{this.role}}: {{this.content}}
  {{/each}}
  {{/if}}

  User's Question:
  {{{query}}}

  Your Answer:
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
