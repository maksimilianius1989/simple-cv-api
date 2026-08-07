import { Injectable } from '@nestjs/common';
import { IRenderToHtml } from '@template/application/ports/render-to-html.interface';
import Handlebars from 'handlebars';

@Injectable()
export class HandlebarsRender implements IRenderToHtml {
  render(htmlTemplate: string, content: Record<string, any>): string {
    const renderTempalte = Handlebars.compile(htmlTemplate);
    return renderTempalte(content);
  }
}
