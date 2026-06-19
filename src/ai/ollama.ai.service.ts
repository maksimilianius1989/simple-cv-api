import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCvDto } from 'src/cv-manager/dto/create-cv.dto';

@Injectable()
export class OllamaAiService {
  constructor(private readonly configService: ConfigService) {}

  async improveSummary(summary: string): Promise<CreateCvDto> {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        position: { type: 'string' },
        contacts: {
          type: 'object',
          properties: {
            phone: { type: 'string' },
            email: { type: 'string' },
            location: { type: 'string' },
            linkedin: { type: 'string' },
          },
        },
        employmentType: { type: 'string' },
        repositories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              url: { type: 'string' },
            },
          },
        },
        summary: { type: 'string' },
        skills: {
          type: 'array',
          items: { type: 'string' },
        },
        template: { type: 'string' },
        salary: { type: 'string' },
        coverLetter: { type: 'string' },
        avatar: { type: 'string' },
        experience: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              company: { type: 'string' },
              position: { type: 'string' },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
      },
    };

    const prompt = `
Convert the following resume text into JSON.

Return ONLY valid JSON.
Return ONLY UA OR ENG.
Schema:
${JSON.stringify(schema, null, 2)}

Resume text:
${summary}
`;

    const controllerA = new AbortController();
    setTimeout(() => {
      controllerA.abort();
    }, this.configService.getOrThrow<number>('OLLAMA_TIMEOUT'));

    console.info('Sent request to OLLAMA SIMPLE CV');

    const response = await fetch(
      `${this.configService.getOrThrow<string>('OLLAMA_HOST')}/api/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${this.configService.getOrThrow<string>('OLLAMA_USER')}:${this.configService.getOrThrow<string>('OLLAMA_PASS')}`,
            ).toString('base64'),
        },
        body: JSON.stringify({
          model: this.configService.getOrThrow<string>('OLLAMA_MODEL'),
          prompt,
          stream: false,
          format: 'json',
        }),
        signal: controllerA.signal,
      },
    );

    const data = await response.json();

    return JSON.parse(data.response) as CreateCvDto;
  }
}
