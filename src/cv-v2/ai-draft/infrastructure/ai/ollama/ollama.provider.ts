import { AiDraftContentDto } from '@ai-draft/application/contracts/ai-draft-content.dto';
import { AiProvider } from '@ai-draft/application/ports/ai-provider.interface';
import { Injectable } from '@nestjs/common';
import { OllamaClient } from './ollama.client';
import { ollamaDraftContentSchema } from './schemas/ai-draft-content.schema';

@Injectable()
export class OllamaProvider implements AiProvider {
  constructor(private readonly ollamaClient: OllamaClient) {}

  async generate(prompt: string): Promise<AiDraftContentDto> {
    const finalPrompt = this.buildSystemPrompt(prompt);
    const rawResponse = await this.ollamaClient.postGenerate(
      finalPrompt,
      ollamaDraftContentSchema,
    );

    return JSON.parse(rawResponse) as AiDraftContentDto;
  }

  private buildSystemPrompt(prompt: string): string {
    return `
    You are a CV generation system.
Extract information from the input and form a CV draft structure.

LANGUAGE RULE (HIGHEST PRIORITY):
- You MUST respond in the same language as the input prompt.
- If the prompt is Ukrainian → respond in Ukrainian.

INPUT:
    ${prompt}
    `;
  }
}
