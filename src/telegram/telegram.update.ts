import { Ctx, Help, On, Start, Update } from 'nestjs-telegraf';
import path from 'path';
import { AiService } from 'src/ai/ai.service';
import { PdfService } from 'src/pdf/pdf.service';
import { Context, Input } from 'telegraf';
import { Message } from 'telegraf/types';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly aiSerivce: AiService,
    private readonly pdfService: PdfService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    const imagePath = path.join(process.cwd(), 'assets', 'team.png');
    await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
      caption:
        '👨‍💼: Привіт 👋 ми Simple CV команда. Ми готові створити твоє ідеальне резюме! Розкажи нам щось про себе.',
    });
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply('Напиши щось 🙂');
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context & { message: Message.TextMessage }) {
    const imagePath = path.join(process.cwd(), 'assets', 'alex.png');
    await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
      caption: `👨‍💼: Я Alex і я формую твоє резюме на основі твоєї інформації. Зачекай хвилинку... 🙂`,
    });

    const aiCvData = await this.aiSerivce.improveSummary(ctx.message.text);
    const pdfBuffer = await this.pdfService.generatePdf(aiCvData);

    await ctx.replyWithDocument(
      {
        source: pdfBuffer,
        filename: 'cv.pdf',
      },
      {
        caption:
          '👨‍💼: Подивись, будь ласка, як тобі такий варіант? Якщо хочеш змінити інформацію про себе, опиши знову, і я з задоволенням зформую нове резюме, яке буде ще краще за попереднє! 🙂',
      },
    );
  }
}
