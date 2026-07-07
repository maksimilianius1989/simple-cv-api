export const PDF_GENERATEOR_PORT = Symbol('PDF_GENERATEOR_PORT');

export interface IPdfGenerator {
  generate(templateName: string, data: Record<string, any>): Promise<Buffer>;
}
