import { Module } from '@nestjs/common';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { GetAllTemplatesWithoutBodyHandler } from './application/queries/get-all-templates-without-body/get-all-templates-without-body.handler';
import { TEMPLATE_REPOSITORY } from './domain/repositories/template.repository.interface';
import { PrismaTemplateRepository } from './infrastructure/persistance/prisma-template.repository';
import { GetTemplateByIdHandler } from './application/queries/get-template-by-id/get-template-by-id.handler';
import { TemplateController } from './presentation/template.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetRandomTemplateIdHandler } from './application/queries/get-random-template/get-random-template-id.handler';
import { CheckTemplateExistanceHandler } from './application/queries/check-template-existance/check-template-existance.handler';
import { RenderTemplateWithContentHandler } from './application/queries/render-template-with-content/render-template-with-content.handler';
import { RENDER_TO_HTML } from './application/ports/render-to-html.interface';
import { HandlebarsRender } from './infrastructure/rendering/handlebars.render';
import { QrModule } from '@shared/infrastructure/qr/qr.module';

@Module({
  imports: [PrismaModule, CqrsModule, QrModule],
  providers: [
    GetAllTemplatesWithoutBodyHandler,
    GetTemplateByIdHandler,
    GetRandomTemplateIdHandler,
    CheckTemplateExistanceHandler,
    RenderTemplateWithContentHandler,
    {
      provide: TEMPLATE_REPOSITORY,
      useClass: PrismaTemplateRepository,
    },
    {
      provide: RENDER_TO_HTML,
      useClass: HandlebarsRender,
    },
  ],
  controllers: [TemplateController],
  exports: [GetRandomTemplateIdHandler, CheckTemplateExistanceHandler],
})
export class TemplateModule {}
