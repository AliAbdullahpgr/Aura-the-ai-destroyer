'use server';

/**
 * @fileOverview A flow to generate dynamic background visuals based on the AI's emotional state.
 *
 * - generateDynamicBackgroundVisuals - A function that generates background visuals for the game based on the AI's emotional state.
 * - DynamicBackgroundVisualsInput - The input type for the generateDynamicBackgroundVisuals function.
 * - DynamicBackgroundVisualsOutput - The return type for the generateDynamicBackgroundVisuals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicBackgroundVisualsInputSchema = z.object({
  empathyLevel: z
    .number()
    .describe('The empathy level of the AI (0-100).'),
  certaintyLevel: z
    .number()
    .describe('The certainty level of the AI (0-100).'),
});
export type DynamicBackgroundVisualsInput = z.infer<typeof DynamicBackgroundVisualsInputSchema>;

const DynamicBackgroundVisualsOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});
export type DynamicBackgroundVisualsOutput = z.infer<typeof DynamicBackgroundVisualsOutputSchema>;

export async function generateDynamicBackgroundVisuals(
  input: DynamicBackgroundVisualsInput
): Promise<DynamicBackgroundVisualsOutput> {
  return dynamicBackgroundVisualsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicBackgroundVisualsPrompt',
  input: {schema: DynamicBackgroundVisualsInputSchema},
  output: {schema: DynamicBackgroundVisualsOutputSchema},
  prompt: `You are a visual artist creating background visuals to reflect the state of an AI.

The AI has an empathy level of {{{empathyLevel}}} and a certainty level of {{{certaintyLevel}}}.

Generate a visually compelling image that represents these states. Use abstract data flows and color shifts to create emotional impact.

Consider these guidelines:

*   **Empathy**: Low empathy should be represented with cold blue tones, and high empathy with warm orange/gold tones.
*   **Certainty**: High certainty should be represented with defined, structured data flows. Low certainty should be represented with glitch effects and distortions.

Return the URL of the generated image. The image should be a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.

Output only the image URL in the output field.`,
});

const dynamicBackgroundVisualsFlow = ai.defineFlow(
  {
    name: 'dynamicBackgroundVisualsFlow',
    inputSchema: DynamicBackgroundVisualsInputSchema,
    outputSchema: DynamicBackgroundVisualsOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      empathyLevel: input.empathyLevel,
      certaintyLevel: input.certaintyLevel,
    });
    
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a visual representation of an AI with empathy level ${input.empathyLevel} and certainty level ${input.certaintyLevel}. Use abstract data flows and color shifts.`,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate image.');
    }

    return {imageUrl: media.url};
  }
);
