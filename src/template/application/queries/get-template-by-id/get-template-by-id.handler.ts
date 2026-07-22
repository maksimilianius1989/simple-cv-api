import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTemplateByIdQuery } from './get-template-by-id.query';
import {
  type ITemplateRepository,
  TEMPLATE_REPOSITORY,
} from '@template/domain/repositories/template.repository.interface';
import { Inject } from '@nestjs/common';
import { Template } from '@template/domain/entities/template.entity';
import { TemplateNotFoundException } from '@template/domain/exceptions';

@QueryHandler(GetTemplateByIdQuery)
export class GetTemplateByIdHandler implements IQueryHandler<GetTemplateByIdQuery> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY as symbol)
    private readonly templateRepo: ITemplateRepository,
  ) {}

  async execute(query: GetTemplateByIdQuery): Promise<Template> {
    const template = await this.templateRepo.getById(query.id);
    if (!template) {
      throw new TemplateNotFoundException(query.id);
    }

    return template;
  }
}
