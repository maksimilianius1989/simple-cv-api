import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OllamaClient {
  constructor(private readonly configService: ConfigService) {}

  async postGenerate(prompt: string, formatSchema: object): Promise<string> {
    const host = this.configService.getOrThrow<string>('OLLAMA_HOST');
    const model = this.configService.getOrThrow<string>('OLLAMA_MODEL');
    const user = this.configService.getOrThrow<string>('OLLAMA_USER');
    const pass = this.configService.getOrThrow<string>('OLLAMA_PASS');
    const timeout = this.configService.getOrThrow<number>('OLLAMA_TIMEOUT');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const authHeader = 'Basic ' + Buffer.from(user + ':' + pass).toString();

      const response = await fetch(`${host}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          format: formatSchema,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama HTTP error! Status: ${response.status}`);
      }

      const data: OlamaResponse = await response.json();
      return data.response ?? '{}';
    } catch (error: any) {
      if (error.name === 'TimeoutError') {
        throw new InternalServerErrorException('Ollama request time out');
      }

      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}

interface OlamaResponse {
  response?: string;
}
