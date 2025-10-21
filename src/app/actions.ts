'use server';

import { aiVoiceEvolution, type AiVoiceEvolutionInput } from "@/ai/flows/ai-voice-evolution";

export async function getAiVoice(input: AiVoiceEvolutionInput) {
    try {
        const result = await aiVoiceEvolution(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in getAiVoice:", error);
        return { success: false, error: "Failed to generate AI voice." };
    }
}
