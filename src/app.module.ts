import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai-old/ai.module';
import { PdfModule } from './pdf/pdf.module';
import { TelegramModule } from './telegram/telegram.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CvModule } from './cv/cv.module';
import { QrModule } from './qr/qr.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CvFileModule } from './cv-file/cv-file.module';
import { CvManagerModule } from './cv-manager/cv-manager.module';
import { CvFeedbackModule } from './cv-feedback/cv-feedback.module';
import { CvModule as CvV2Module } from './cv-v2/cv.module';
import { SharedKafkaModule } from '@shared/infrastructure/kafka/kafka.module';
import { ClientKafka } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    SharedKafkaModule,
    PrismaModule,
    QrModule,
    AuthModule,
    AiModule,
    PdfModule,
    TelegramModule,
    UserModule,
    CvModule,
    CvFileModule,
    CvManagerModule,
    CvFeedbackModule,
    CvV2Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();

    this.kafkaClient.subscribeToResponseOf('feedback.created');
  }
}
