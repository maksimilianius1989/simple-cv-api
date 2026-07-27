export const PDF_GENERATEOR_PORT = Symbol('PDF_GENERATEOR_PORT');
export interface IPdfGenerator {
  generate(htmlTemplate: string, data: Record<string, any>): Promise<Buffer>;
}
