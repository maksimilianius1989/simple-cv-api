import {
  IAiProvider,
  IAiProviderOptions,
} from '@ai/application/ports/ai-provider.interface';
import { Injectable } from '@nestjs/common';
import { OllamaClient } from './ollama.client';

@Injectable()
export class OllamaProvider implements IAiProvider {
  constructor(private readonly ollamaClient: OllamaClient) {}

  async generate(options: IAiProviderOptions): Promise<string> {
    const formattedPrompt = `
${options.systemPrompt}
Extract information from the input and form a CV draft structure.

LANGUAGE RULE (HIGHEST PRIORITY):
- You MUST respond in the same language as the input prompt.
- If the prompt is Ukrainian → respond in Ukrainian.

INPUT:
${options.prompt}
`.trim();

    return await this.ollamaClient.postGenerate(
      formattedPrompt,
      options.responseSchema,
    );
  }
}
