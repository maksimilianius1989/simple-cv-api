import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/ai.module';
import { PdfModule } from './pdf/pdf.module';
import { TelegramModule } from './telegram/telegram.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CvModule } from './cv/cv.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { QrModule } from './qr/qr.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    QrModule,
    AuthModule,
    AiModule,
    PdfModule,
    TelegramModule,
    UserModule,
    CvModule,
    ServeStaticModule.forRoot({
      rootPath: '/app/src/uploads',
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
