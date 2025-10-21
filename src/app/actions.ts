'use server';

import { aiVoiceEvolution, type AiVoiceEvolutionInput } from "@/ai/flows/ai-voice-evolution";
import { generateDynamicBackgroundVisuals, type DynamicBackgroundVisualsInput } from "@/ai/flows/dynamic-background-visuals";

export async function getAiVoice(input: AiVoiceEvolutionInput) {
    try {
        const result = await aiVoiceEvolution(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in getAiVoice:", error);
        return { success: false, error: "Failed to generate AI voice." };
    }
}

export async function getDynamicBackground(input: DynamicBackgroundVisualsInput) {
    try {
        const result = await generateDynamicBackgroundVisuals(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in getDynamicBackground:", error);
        return { success: false, error: "Failed to generate background." };
    }
}
