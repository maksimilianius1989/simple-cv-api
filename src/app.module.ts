import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CvModule } from './cv/cv.module';
import { SharedKafkaModule } from './shared/infrastructure/kafka/kafka.module';
import { ClientKafka } from '@nestjs/microservices';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import DomainExceptionFilter from '@shared/filters/domain-exception.filter';
import { AllExceptionFilter } from '@shared/filters/all-exception.filter';
import { JwtGuard } from '@auth/infrastructure/guards/jwt.guard';
import { LegalGuard } from '@shared/infrastructure/guards/legal.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    SharedKafkaModule,
    PrismaModule,
    AuthModule,
    TelegramModule,
    CvModule.register((process.env.APP_MODE as 'API' | 'WORKER') || 'API'),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: LegalGuard,
    },
  ],
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
