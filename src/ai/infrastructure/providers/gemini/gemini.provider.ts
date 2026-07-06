import { GoogleGenAI } from '@google/genai';
import {
  IAiProvider,
  IAiProviderOptions,
} from '../../../application/ports/ai-provider.interface';

export class GeminiProvider implements IAiProvider {
  async generate(
    options: IAiProviderOptions,
    apiKey?: string,
  ): Promise<string> {
    if (!apiKey) throw new Error('API key is required for Gemimi');

    const extendedSystemInstruction = `
${options.systemPrompt ?? 'You are a CV generation system.'}

LANGUAGE RULE (HIGHEST PRIORITY):
- You MUST respond in the same language as the input prompt.
- If the prompt is Ukrainian → respond in Ukrainian.
- If the prompt is English → respond in English.
- If mixed → use the dominant language.
- Never default to English unless input is English.

OUTPUT FORMAT:
Return ONLY valid JSON.
`.trim();

    const formattedContent = `
INPUT:
${options.prompt}
`.trim();

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContent,
      config: {
        systemInstruction: extendedSystemInstruction,
        responseMimeType: options.responseSchema
          ? 'application/json'
          : 'text/plain',
        responseSchema: options.responseSchema,
      },
    });

    return response.text ?? '{}';
  }
}
