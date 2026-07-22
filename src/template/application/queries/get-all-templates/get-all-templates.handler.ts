import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllTemplatesQuery } from './get-all-templates.query';
import { Inject } from '@nestjs/common';
import {
  type ITemplateRepository,
  TEMPLATE_REPOSITORY,
} from '../../../domain/repositories/template.repository.interface';
import { Template } from '@template/domain/entities/template.entity';

@QueryHandler(GetAllTemplatesQuery)
export class GetAllTemplatesHandler implements IQueryHandler<GetAllTemplatesQuery> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY as symbol)
    private readonly templateRepo: ITemplateRepository,
  ) {}

  async execute(query: GetAllTemplatesQuery): Promise<Template[]> {
    return await this.templateRepo.getAll();
  }
}
