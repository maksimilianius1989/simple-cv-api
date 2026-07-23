import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRandomTemplateIdQuery } from './get-random-template-id.query';
import { Inject } from '@nestjs/common';
import {
  type ITemplateRepository,
  TEMPLATE_REPOSITORY,
} from '../../../domain/repositories/template.repository.interface';
import { TemplateNotFoundException } from '@template/domain/exceptions';

@QueryHandler(GetRandomTemplateIdQuery)
export class GetRandomTemplateIdHandler implements IQueryHandler<GetRandomTemplateIdQuery> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY as symbol)
    private readonly templateRepo: ITemplateRepository,
  ) {}

  async execute(query: GetRandomTemplateIdQuery): Promise<{ id: string }> {
    const templateId = await this.templateRepo.getRandomTemplateId(
      query.category,
    );

    if (!templateId) {
      throw new TemplateNotFoundException();
    }

    return { id: templateId };
  }
}
