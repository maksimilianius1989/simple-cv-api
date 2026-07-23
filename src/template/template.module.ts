import { Module } from '@nestjs/common';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { GetAllTemplatesHandler } from './application/queries/get-all-templates/get-all-templates.handler';
import { TEMPLATE_REPOSITORY } from './domain/repositories/template.repository.interface';
import { PrismaTemplateRepository } from './infrastructure/persistance/prisma-template.repository';
import { GetTemplateByIdHandler } from './application/queries/get-template-by-id/get-template-by-id.handler';
import { TemplateController } from './presentation/template.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetRandomTemplateIdHandler } from './application/queries/get-random-template/get-random-template-id.handler';
import { CheckTemplateExistanceHandler } from './application/queries/check-template-existance/check-template-existance.handler';

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [
    GetAllTemplatesHandler,
    GetTemplateByIdHandler,
    GetRandomTemplateIdHandler,
    CheckTemplateExistanceHandler,
    {
      provide: TEMPLATE_REPOSITORY,
      useClass: PrismaTemplateRepository,
    },
  ],
  controllers: [TemplateController],
  exports: [GetRandomTemplateIdHandler, CheckTemplateExistanceHandler],
})
export class TemplateModule {}
