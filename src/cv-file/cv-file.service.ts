import { Injectable } from '@nestjs/common';
import { CvFile, FileType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CvFileStorageService } from './cv-file-storage.service';

@Injectable()
export class CvFileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storage: CvFileStorageService,
  ) {}

  async findById(id: string) {
    return await this.prismaService.cvFile.findFirst({
      where: { id },
    });
  }

  async saveCvFile(params: {
    userId: string;
    cvId: string;
    fileName: string;
    buffer: Buffer;
    mimeType: string;
    type: FileType;
  }): Promise<CvFile> {
    const file = await this.storage.saveCvFile(
      params.userId,
      params.cvId,
      params.fileName,
      params.buffer,
    );

    return this.prismaService.cvFile.upsert({
      where: {
        cvId_type: {
          cvId: params.cvId,
          type: params.type,
        },
      },
      create: {
        cvId: params.cvId,
        type: params.type,
        path: file.path,
        filename: params.fileName,
        mimeType: params.mimeType,
        size: file.size,
      },
      update: {
        path: file.path,
        filename: params.fileName,
        mimeType: params.mimeType,
        size: file.size,
      },
    });
  }

  async fetchByCv(cvId: string) {
    return await this.prismaService.cvFile.findMany({
      where: { cvId },
    });
  }

  async fetchByCvAndType(cvId: string, type: FileType) {
    return await this.prismaService.cvFile.findFirst({
      where: { cvId, type },
    });
  }

  async deleteByCv(cvId: string) {
    const files = await this.prismaService.cvFile.findMany({
      where: { cvId },
    });

    for (const file of files) {
      await this.storage.deleteFile(file.path);
    }

    await this.prismaService.cvFile.deleteMany({
      where: { cvId },
    });
  }

  async disableAccessByCv(cvId) {
    return await this.prismaService.cvFile.updateMany({
      where: { cvId },
      data: { isPublished: false },
    });
  }

  getPublicUrl(filePath: string): string {
    const uploadsRoot = this.storage.getUploadRoot();

    return filePath.replace(uploadsRoot, 'uploads');
  }
}
