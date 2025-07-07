'use server';

import { summarizePayload, SummarizePayloadInput } from '@/ai/flows/summarize-payload';

export async function generateSummaryAction(payload: Record<string, any>): Promise<{ summary: string | null; error: string | null; }> {
  try {
    const input: SummarizePayloadInput = {
      payload: JSON.stringify(payload),
    };

    const result = await summarizePayload(input);
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error("Error summarizing payload:", error);
    return { summary: null, error: 'Failed to generate summary. Please try again.' };
  }
}
