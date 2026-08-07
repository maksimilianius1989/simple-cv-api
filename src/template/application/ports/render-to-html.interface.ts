export const RENDER_TO_HTML = Symbol('RENDER_TO_HTML');
export interface IRenderToHtml {
  render(htmlTemplate: string, content: Record<string, any>): string;
}
