import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeneratePdfDto } from 'src/pdf/dto/generate-pdf.dto';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async improveSummary(summary: string): Promise<GeneratePdfDto> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: summary,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              position: { type: 'string' },
              summary: { type: 'string' },
              template: { type: 'string' },
              skills: {
                type: 'array',
                items: { type: 'string' },
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
            required: [
              'name',
              'position',
              'summary',
              'template',
              'skills',
              'experience',
            ],
          },
        },
      });

      const responseFromAi = JSON.parse(
        response.text ?? '{}',
      ) as GeneratePdfDto;

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

      responseFromAi.template = randomTemplate;

      return responseFromAi;
    } catch (error) {
      console.warn('GENINI ERROR: ', error);
      throw new Error('Gemini returned invalid JSON');
    }
  }
}
