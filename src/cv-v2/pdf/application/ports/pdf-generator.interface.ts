export interface IPdfGenerator {
  generate(templateName: string, data: any): Promise<Buffer>;
}
