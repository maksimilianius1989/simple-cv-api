export const IFILE_STORAGE = Symbol('IFILE_STORAGE');

export interface IFileStorage {
  save(
    userId: string,
    cvId: string,
    filename: string,
    buffer: Buffer,
  ): Promise<{ path: string; size: number }>;

  delete(filePath: string): Promise<void>;

  deleteCvDirectory(userId: string, cvId: string): Promise<void>;
}
