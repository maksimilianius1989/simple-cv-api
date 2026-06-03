import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async improveSummary(summary: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Створи резюме на основі цього тексту:
      
      ${summary}
      
      Відпоідь віддай в форматі json, ось такої структури:
      {
        "name": "",
        "position": "",
        "summary": "",
        "template": "dark",
        "skills": [],
        "experience": [
          {
            "company": "",
            "position": "",
            "startDate": "",
            "endDate": "",
            "description": ""
          },
        ]
      }
        
      Опис полів:
      name - імя
      position - на яку позицію претендує
      summary - Опис про себе
      template - тип шаблону, залиш template
      experience - перелічення доствіду, де працював раніше. Поля:
        company - назва команії де працював
        position - ким працював
        startDate - endDate - дата з якої по яку працював
        description - опис, що робив`,
    });

    return this.extractJson(response.text ?? '');
  }

  extractJson(text: string): string {
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned) as string;
  }
}
