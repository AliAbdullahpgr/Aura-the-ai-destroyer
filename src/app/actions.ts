'use server';

import { generateAiTextResponse, type AiTextResponseInput } from "@/ai/flows/ai-text-response";

export async function getAiResponse(input: AiTextResponseInput) {
    try {
        const result = await generateAiTextResponse(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in getAiResponse:", error);
        return { success: false, error: "Failed to generate AI response." };
    }
}
