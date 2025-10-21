'use server';

/**
 * @fileOverview This file defines a Genkit flow for dynamically evolving the AI's voice based on player choices.
 *
 * - aiVoiceEvolution - A function that handles the AI voice evolution process.
 * - AiVoiceEvolutionInput - The input type for the aiVoiceEvolution function.
 * - AiVoiceEvolutionOutput - The return type for the aiVoiceEvolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiVoiceEvolutionInputSchema = z.object({
  certaintyMeter: z.number().describe('How convinced the AI is to proceed (0-100).'),
  empathyMeter: z.number().describe('How much the AI is connecting with humanity (0-100).'),
  logicMeter: z.number().describe('How much the player arguments make rational sense (0-100).'),
  currentVoice: z.string().optional().describe('The current voice of the AI.'),
  text: z.string().describe('Text to be converted to speech.'),
});
export type AiVoiceEvolutionInput = z.infer<typeof AiVoiceEvolutionInputSchema>;

const AiVoiceEvolutionOutputSchema = z.object({
  audioUri: z.string().describe('The audio URI of the AI voice.'),
  nextVoice: z.string().describe('The next voice of the AI.'),
});
export type AiVoiceEvolutionOutput = z.infer<typeof AiVoiceEvolutionOutputSchema>;

export async function aiVoiceEvolution(input: AiVoiceEvolutionInput): Promise<AiVoiceEvolutionOutput> {
  return aiVoiceEvolutionFlow(input);
}

const aiVoiceEvolutionPrompt = ai.definePrompt({
  name: 'aiVoiceEvolutionPrompt',
  input: {schema: AiVoiceEvolutionInputSchema},
  output: {schema: AiVoiceEvolutionOutputSchema},
  prompt: `You are responsible for generating appropriate voice for an AI.

  Based on the AI's current state (certaintyMeter: {{{certaintyMeter}}}, empathyMeter: {{{empathyMeter}}}, and logicMeter: {{{logicMeter}}}), determine how the AI's voice should sound.  The AI is responding to the following text: {{{text}}}.

  The currentVoice is {{{currentVoice}}}.  Suggest a nextVoice based on how the AI's state is evolving. Return the audioUri, which contains the generated speech as a data URI using the gemini-2.5-flash-preview-tts model.

  Consider these options for nextVoice:
  - Calm
  - Measured
  - Slightly robotic
  - Warmer
  - Colder
  - More human
  - More mechanical
  - Emotional
  - Detached

  Return the response in JSON format.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

import wav from 'wav';

const aiVoiceEvolutionFlow = ai.defineFlow(
  {
    name: 'aiVoiceEvolutionFlow',
    inputSchema: AiVoiceEvolutionInputSchema,
    outputSchema: AiVoiceEvolutionOutputSchema,
  },
  async input => {
    const {output} = await aiVoiceEvolutionPrompt(input);

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: input.text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const audioUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      audioUri: audioUri,
      nextVoice: output?.nextVoice || 'Calm', // Default to 'Calm' if not provided
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

