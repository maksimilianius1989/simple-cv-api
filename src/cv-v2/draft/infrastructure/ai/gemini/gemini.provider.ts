import { AiDraftContentDto } from '@draft/application/contracts/ai-draft-content.dto';
import { AiProvider } from '@draft/application/ports/ai-provider.interface';
import { GoogleGenAI } from '@google/genai';
import { aiDraftContentSchema } from './schemas/ai-draft-content.shema';

export class GeminiProvider implements AiProvider {
  async generate(prompt: string, apiKey?: string): Promise<AiDraftContentDto> {
    if (!apiKey) throw new Error('API key is required for Gemini');

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const finalPrompt = `
You are a CV generation system.

LANGUAGE RULE (HIGHEST PRIORITY):
- You MUST respond in the same language as the input prompt.
- If the prompt is Ukrainian → respond in Ukrainian.
- If the prompt is English → respond in English.
- If mixed → use the dominant language.
- Never default to English unless input is English.

OUTPUT FORMAT:
Return ONLY valid JSON.

INPUT:
${prompt}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: aiDraftContentSchema,
      },
    });

    return JSON.parse(response.text ?? '{}') as AiDraftContentDto;
  }
}
