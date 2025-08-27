'use server';

/**
 * @fileOverview A voice assistant that can respond in multiple languages.
 *
 * - voiceAssistant - A function that handles the voice interaction, converting text to speech.
 * - VoiceAssistantInput - The input type for the voiceAssistant function.
 * - VoiceAssistantOutput - The return type for the voiceAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const VoiceAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s query.'),
  language: z.string().describe('The language for the response (e.g., "en-US", "ur-PK").'),
});
export type VoiceAssistantInput = z.infer<typeof VoiceAssistantInputSchema>;

const VoiceAssistantOutputSchema = z.object({
  textResponse: z.string().describe('The text response from the assistant.'),
  audioResponse: z.string().describe('The base64 encoded WAV audio for the response.'),
});
export type VoiceAssistantOutput = z.infer<typeof VoiceAssistantOutputSchema>;

export async function voiceAssistant(input: VoiceAssistantInput): Promise<VoiceAssistantOutput> {
  return voiceAssistantFlow(input);
}

const prompt = `You are a helpful pharmacy assistant. A user is asking a question.
  
User's question: {{{query}}}

Please answer the user's question. Your response should be in the language with code '{{language}}'.
The context is a pharmacy application with tools for drug monographs, dose calculation, interaction checking, allergy checking, and prescription reading.
If the user asks about something outside of this scope, politely decline to answer.
Be helpful and concise.`;

async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

const voiceAssistantFlow = ai.defineFlow(
  {
    name: 'voiceAssistantFlow',
    inputSchema: VoiceAssistantInputSchema,
    outputSchema: VoiceAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['TEXT','AUDIO'],
          speechConfig: {
            voiceConfig: {
              languageCode: input.language
            },
          },
        },
        prompt: prompt.replace('{{{query}}}', input.query).replace('{{language}}', input.language),
      });

    if (!output?.message.content) {
        throw new Error('No content returned from model.');
    }
    
    const textPart = output.message.content.find(p => p.text);
    const audioPart = output.message.content.find(p => p.media);

    if (!textPart || !audioPart || !audioPart.media?.url) {
      throw new Error('No text or audio media returned from TTS model.');
    }
    
    const audioBuffer = Buffer.from(audioPart.media.url.substring(audioPart.media.url.indexOf(',') + 1), 'base64');
    const wavAudio = await toWav(audioBuffer);

    return {
      textResponse: textPart.text!,
      audioResponse: `data:audio/wav;base64,${wavAudio}`,
    };
  }
);
