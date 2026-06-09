import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { GeneratePdfDto } from 'src/pdf/dto/generate-pdf.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prismaService: PrismaService) {}

  async improveSummary(summary: string): Promise<GeneratePdfDto> {
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
                summary: { type: 'string' },
                template: { type: 'string' },
                skills: { type: 'array', items: { type: 'string' } },
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
              `Gemini unavailable. Retry ${attempt}/${retries} in ${delay}ms`,
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

        const result = JSON.parse(response.text ?? '{}') as GeneratePdfDto;

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

        console.warn('Gemini error:', error);
        continue;
      }
    }

    throw new Error('All Gemini API keys failed or exhausted');
  }

  private createAiClient(apiKey: string) {
    return new GoogleGenAI({ apiKey });
  }

  async getAvailableApiKey() {
    return this.prismaService.$transaction(async (tx) => {
      const keys = await tx.geminiApiKey.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          updatedAt: 'asc',
        },
      });

      const now = new Date();

      for (const key of keys) {
        if (!this.isSameDay(key.usageDate, now)) {
          await tx.geminiApiKey.update({
            where: { id: key.id },
            data: {
              usedToday: 0,
              usageDate: now,
            },
          });

          key.usedToday = 0;
        }

        if (key.usedToday < key.usageLimit) {
          await tx.geminiApiKey.update({
            where: { id: key.id },
            data: {
              usedToday: {
                increment: 1,
              },
            },
          });

          return key;
        }
      }

      throw new Error('No available Gemini API keys');
    });
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() === b.getUTCMonth() &&
      a.getUTCDate() === b.getUTCDate()
    );
  }
}
