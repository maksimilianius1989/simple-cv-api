export interface IFileDownloaderResult {
  tempFilePath: string;
  mimeType: string;
  size: number;
  originalFileName: string | null;
}

export const FILE_DOWNLOADER = Symbol('FILE_DOWNLOADER');
export interface IFileDownloader {
  downloadWithStreamLimit(
    url: string,
    maxSizeInBytes: number,
  ): Promise<IFileDownloaderResult>;
}
