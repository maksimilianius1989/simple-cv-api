import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckTemplateExistanceQuery } from './check-template-existance.query';
import { Inject } from '@nestjs/common';
import {
  type ITemplateRepository,
  TEMPLATE_REPOSITORY,
} from '@template/domain/repositories/template.repository.interface';
import { TemplateNotFoundException } from '@template/domain/exceptions';

@QueryHandler(CheckTemplateExistanceQuery)
export class CheckTemplateExistanceHandler implements IQueryHandler<CheckTemplateExistanceQuery> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY as symbol)
    private readonly templateRepo: ITemplateRepository,
  ) {}

  async execute(query: CheckTemplateExistanceQuery): Promise<void> {
    const isExist = await this.templateRepo.exist(query.templateId);
    if (!isExist) {
      throw new TemplateNotFoundException(query.templateId);
    }
  }
}
