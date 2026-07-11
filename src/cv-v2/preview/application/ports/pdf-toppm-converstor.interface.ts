export const PDF_TO_PPM_CONVERTOR = Symbol('PDF_TO_PPM_CONVERTOR');

export interface IPdfToPpmConvertor {
  convertFirstPageToPng(pdfPath: string): Promise<Buffer>;
}
