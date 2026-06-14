import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fsPromises from 'fs/promises';
import path from 'path';

@Injectable()
export class CvFileStorageService {
  constructor(private readonly configService: ConfigService) {}

  async getCvDir(userId: string, cvId: string): Promise<string> {
    const dir = path.join(this.getUploadRoot(), 'users', userId, 'cvs', cvId);

    await this.ensureDir(dir);

    return dir;
  }

  async saveCvFile(
    userId: string,
    cvId: string,
    fileName: string,
    buffer: Buffer,
  ): Promise<{ path: string; size: number }> {
    const dir = await this.getCvDir(userId, cvId);

    const fullPath = path.join(dir, fileName);
    
    await fsPromises.writeFile(fullPath, buffer);

    return {
      path: fullPath,
      size: buffer.length,
    };
  }

  async readFile(filePath: string): Promise<Buffer> {
    return fsPromises.readFile(filePath);
  }

  async deleteFile(filePath: string) {
    await fsPromises.rm(filePath, { force: true });
  }

  async deleteCv(userId: string, cvId: string): Promise<void> {
    const dir = path.join(this.getUploadRoot(), 'users', userId, 'cvs', cvId);

    await fsPromises.rm(dir, { recursive: true, force: true });
  }

  private async ensureDir(dirPath: string): Promise<void> {
    await fsPromises.mkdir(dirPath, { recursive: true });
  }

  private getUploadRoot(): string {
    return this.configService.getOrThrow<string>('UPLOADS_PATH');
  }
}
