import { Module } from '@nestjs/common';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { GetAllTemplatesHandler } from './application/queries/get-all-templates/get-all-templates.handler';
import { TEMPLATE_REPOSITORY } from './domain/repositories/template.repository.interface';
import { PrismaTemplateRepository } from './infrastructure/persistance/prisma-template.repository';
import { GetTemplateByIdHandler } from './application/queries/get-template-by-id/get-template-by-id.handler';
import { TemplateController } from './presentation/template.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [
    GetAllTemplatesHandler,
    GetTemplateByIdHandler,
    {
      provide: TEMPLATE_REPOSITORY,
      useClass: PrismaTemplateRepository,
    },
  ],
  controllers: [TemplateController],
})
export class TemplateModule {}
