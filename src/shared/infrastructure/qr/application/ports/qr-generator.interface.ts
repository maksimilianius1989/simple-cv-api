export const QR_GENERATOR_PORT = Symbol('QR_GENERATOR_PORT');
export interface IQrGenerator {
  generateDataUrl(text: string): Promise<string>;
}
