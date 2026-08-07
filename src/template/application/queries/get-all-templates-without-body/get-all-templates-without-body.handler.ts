import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  type ITemplateRepository,
  TEMPLATE_REPOSITORY,
} from '../../../domain/repositories/template.repository.interface';
import { Template } from '@template/domain/entities/template.entity';
import { GetAllTemplatesWithoutBodyQuery } from './get-all-templates-without-body.query';

@QueryHandler(GetAllTemplatesWithoutBodyQuery)
export class GetAllTemplatesWithoutBodyHandler implements IQueryHandler<GetAllTemplatesWithoutBodyQuery> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY as symbol)
    private readonly templateRepo: ITemplateRepository,
  ) {}

  async execute(query: GetAllTemplatesWithoutBodyQuery): Promise<Template[]> {
    return await this.templateRepo.getAll({ body: true });
  }
}
