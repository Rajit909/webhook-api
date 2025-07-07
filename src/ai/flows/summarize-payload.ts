// Summarize Payload Flow
'use server';
/**
 * @fileOverview Summarizes webhook payloads using AI to extract key data points.
 *
 * - summarizePayload - A function that summarizes the webhook payload.
 * - SummarizePayloadInput - The input type for the summarizePayload function.
 * - SummarizePayloadOutput - The return type for the summarizePayload function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePayloadInputSchema = z.object({
  payload: z.string().describe('The JSON payload of the webhook.'),
});
export type SummarizePayloadInput = z.infer<typeof SummarizePayloadInputSchema>;

const SummarizePayloadOutputSchema = z.object({
  summary: z.string().describe('A summary of the key data points in the payload.'),
});
export type SummarizePayloadOutput = z.infer<typeof SummarizePayloadOutputSchema>;

export async function summarizePayload(input: SummarizePayloadInput): Promise<SummarizePayloadOutput> {
  return summarizePayloadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePayloadPrompt',
  input: {schema: SummarizePayloadInputSchema},
  output: {schema: SummarizePayloadOutputSchema},
  prompt: `You are an AI assistant that summarizes webhook payloads. Analyze the following JSON payload and provide a concise summary of the key data points, excluding low-value details.\n\nPayload: {{{payload}}}`,
});

const summarizePayloadFlow = ai.defineFlow(
  {
    name: 'summarizePayloadFlow',
    inputSchema: SummarizePayloadInputSchema,
    outputSchema: SummarizePayloadOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
