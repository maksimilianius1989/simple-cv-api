export const FILE_STORAGE = Symbol('FILE_STORAGE');
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
