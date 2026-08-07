import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { RenderTemplateWithContentQuery } from './render-template-with-content.query';
import { GetTemplateByIdQuery } from '../get-template-by-id/get-template-by-id.query';
import { GenerateQrQuery } from '@shared/infrastructure/qr/application/queries/generate-qr/generate-qr.query';
import { Template } from '@template/domain/entities/template.entity';
import { Inject } from '@nestjs/common';
import {
  type IRenderToHtml,
  RENDER_TO_HTML,
} from '@template/application/ports/render-to-html.interface';

@QueryHandler(RenderTemplateWithContentQuery)
export class RenderTemplateWithContentHandler implements IQueryHandler<RenderTemplateWithContentQuery> {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(RENDER_TO_HTML)
    private readonly render: IRenderToHtml,
  ) {}

  async execute(query: RenderTemplateWithContentQuery): Promise<string> {
    const template = await this.queryBus.execute<
      GetTemplateByIdQuery,
      Template
    >(new GetTemplateByIdQuery(query.id));

    let qr = undefined;
    if (query.qrUrl) {
      qr = await this.queryBus.execute(new GenerateQrQuery(query.qrUrl));
    }

    return this.render.render(template.body, {
      ...query.content,
      avatar: query.avatar,
      qr,
    });
  }
}
