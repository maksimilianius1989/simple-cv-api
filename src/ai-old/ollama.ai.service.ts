import { CreateCvDto } from '@cv/presentation/dtos/create-cv.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OllamaAiService {
  constructor(private readonly configService: ConfigService) {}

  async improveSummary(summary: string): Promise<CreateCvDto> {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },

        position: {
          type: 'string',
        },

        contacts: {
          type: 'object',
          properties: {
            phone: { type: 'string' },
            email: { type: 'string' },
            location: { type: 'string' },
            linkedin: { type: 'string' },
          },
          required: [],
        },

        employmentType: {
          type: 'string',
        },

        repositories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              url: { type: 'string' },
            },
            required: ['name', 'url'],
          },
        },

        summary: {
          type: 'string',
        },

        skills: {
          type: 'array',
          items: {
            type: 'string',
          },
        },

        salary: {
          type: 'string',
        },

        coverLetter: {
          type: 'string',
        },

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
            required: [
              'company',
              'position',
              'startDate',
              'endDate',
              'description',
            ],
          },
        },
      },

      required: ['name', 'position', 'coverLetter', 'experience'],
    };

    const prompt = `
Extract information from the resume.
Return only JSON.
Use Ukrainian or English.
Do not invent information.
Unknown string fields -> "".
Unknown arrays -> [].

Resume text:
${summary}
`;

    const controllerA = new AbortController();
    setTimeout(() => {
      controllerA.abort();
    }, this.configService.getOrThrow<number>('OLLAMA_TIMEOUT'));

    console.info(
      `Sent request to OLLAMA ${this.configService.getOrThrow<string>('OLLAMA_MODEL')}`,
    );

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
          format: schema,
        }),
        signal: controllerA.signal,
      },
    );

    const data = await response.json();

    const result = JSON.parse(data.response ?? '{}') as CreateCvDto;

    const templates = [
      'corporate',
      'creative',
      'dark',
      'developer',
      'minimal',
      'modern',
    ];

    const randomTemplate =
      templates[Math.floor(Math.random() * templates.length)];

    result.template = randomTemplate;

    return result;
  }
}
