import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type IFileStorage } from '../../application/ports/file-storage.interface';
import path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class LocalDiskFileStorage implements IFileStorage {
  constructor(private readonly configService: ConfigService) {}
  async save(
    userId: string,
    cvId: string,
    filename: string,
    buffer: Buffer,
  ): Promise<{ path: string; size: number }> {
    const dir = path.join(this.getUploadRoot(), 'users', userId, 'cvs', cvId);
    await fs.mkdir(dir, { recursive: true });

    const fullPath = path.join(dir, filename);
    await fs.writeFile(fullPath, buffer);

    return { path: fullPath, size: buffer.length };
  }

  async delete(filePath: string): Promise<void> {
    await fs.rm(filePath, { force: true });
  }

  async deleteCvDirectory(userId: string, cvId: string): Promise<void> {
    const dir = path.join(this.getUploadRoot(), 'users', userId, 'cvs', cvId);
    await fs.rm(dir, { recursive: true, force: true });
  }

  private getUploadRoot(): string {
    return this.configService.getOrThrow<string>('UPLOADS_PATH');
  }
}
