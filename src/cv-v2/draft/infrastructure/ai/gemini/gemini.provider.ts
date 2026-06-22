import { AiDraftContentDto } from '@draft/application/contracts/ai-draft-content.dto';
import { AiProvider } from '@draft/application/ports/ai-provider.interface';
import { GoogleGenAI } from '@google/genai';
import { aiDraftContentSchema } from './schemas/ai-draft-content.shema';

export class GeminiProvider implements AiProvider {
  constructor(private readonly apiKey: string) {}

  async generate(prompt: string): Promise<AiDraftContentDto> {
    const ai = new GoogleGenAI({ apiKey: this.apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: aiDraftContentSchema,
      },
    });

    return JSON.parse(response.text ?? '{}');
  }
}
