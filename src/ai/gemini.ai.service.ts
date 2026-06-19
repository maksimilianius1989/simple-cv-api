import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiKeysFailed } from './exceptions/api-keys-failed.exception';
import { CreateCvDto } from 'src/cv-manager/dto/create-cv.dto';

@Injectable()
export class GeminiAiService {
  constructor(private readonly prismaService: PrismaService) {}

  async improveSummary(summary: string): Promise<CreateCvDto> {
    const keys = await this.prismaService.geminiApiKey.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'asc' },
    });

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

    const now = new Date();

    for (const key of keys) {
      try {
        // reset лічильника якщо новий день
        if (!this.isSameDay(key.usageDate, now)) {
          await this.prismaService.geminiApiKey.update({
            where: { id: key.id },
            data: {
              usedToday: 0,
              usageDate: now,
            },
          });

          key.usedToday = 0;
        }

        // якщо ліміт вичерпано — пропускаємо
        if (key.usedToday >= key.usageLimit) {
          continue;
        }

        const ai = this.createAiClient(key.apiKey);
        const generatedContent = {
          model: 'gemini-2.5-flash',
          contents: summary,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
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
                  required: [],
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
                    required: ['name', 'url'],
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

              required: ['name', 'position', 'template', 'experience'],
            },
          },
        };

        let response: any = null;
        const retries: number = 3;

        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            response = await ai.models.generateContent(generatedContent);
          } catch (error: any) {
            const isRetryable =
              error?.status === 503 || error?.message?.includes('high demand');

            if (!isRetryable || attempt === retries) {
              throw error;
            }

            const delay = attempt * 2000;

            console.warn(
              `Gemini unavailable.
              Used Key ${key.name} (${key.apiKey})
              Retry ${attempt}/${retries} in ${delay}ms`,
            );

            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        // збільшуємо usage тільки якщо успіх
        await this.prismaService.geminiApiKey.update({
          where: { id: key.id },
          data: {
            usedToday: {
              increment: 1,
            },
          },
        });

        const result = JSON.parse(response.text ?? '{}') as CreateCvDto;

        result.template = randomTemplate;

        return result;
      } catch (error: any) {
        // якщо ключ помер — відмічаємо як неактивний
        if (
          error?.message?.includes('API_KEY') ||
          error?.message?.includes('403') ||
          error?.message?.includes('invalid')
        ) {
          await this.prismaService.geminiApiKey.update({
            where: { id: key.id },
            data: { isActive: false },
          });

          continue;
        }

        console.warn(
          `Used Key ${key.name} (${key.apiKey})
          Gemini error:`,
          error,
        );
        continue;
      }
    }

    throw new ApiKeysFailed('All Gemini API keys failed or exhausted');
  }

  private createAiClient(apiKey: string) {
    return new GoogleGenAI({ apiKey });
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() === b.getUTCMonth() &&
      a.getUTCDate() === b.getUTCDate()
    );
  }
}
