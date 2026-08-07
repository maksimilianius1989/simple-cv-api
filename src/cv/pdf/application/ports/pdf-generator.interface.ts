export const PDF_GENERATEOR_PORT = Symbol('PDF_GENERATEOR_PORT');
export interface IPdfGenerator {
  generate(html: string): Promise<Buffer>;
}
