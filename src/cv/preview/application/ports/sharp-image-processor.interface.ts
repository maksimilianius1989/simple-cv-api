export const SHARP_IMAGE_PROCESSOR = Symbol('SHARP_IMAGE_PROCESSOR');
export interface ISharpImageProcessor {
  resize(imageBuffer: Buffer, width: number): Promise<Buffer>;
}
