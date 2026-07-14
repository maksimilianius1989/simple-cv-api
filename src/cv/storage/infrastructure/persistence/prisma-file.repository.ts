import { Injectable } from '@nestjs/common';
import { IFileRepository } from '../../domain/repositories/file.repository';
import { StoredFile } from '../../domain/entities/stored-file.entity';
import { FileCategory } from '../../domain/enums/file-category.enum';
import { PrismaFileMapper } from './prisma-file.mapper';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaFIleRepository implements IFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<StoredFile | null> {
    const file = await this.prisma.cvFile.findUnique({ where: { id } });
    return file ? PrismaFileMapper.toDomain(file) : null;
  }

  async findByCvAndCategory(
    cvId: string,
    category: FileCategory,
  ): Promise<StoredFile | null> {
    const file = await this.prisma.cvFile.findFirst({
      where: { cvId, type: PrismaFileMapper.toPrismaType(category) },
    });
    return file ? PrismaFileMapper.toDomain(file) : null;
  }

  async findByCv(cvId: string): Promise<StoredFile[]> {
    const files = await this.prisma.cvFile.findMany({ where: { cvId } });
    return files.map((file) => PrismaFileMapper.toDomain(file));
  }

  async save(file: StoredFile): Promise<StoredFile> {
    const type = PrismaFileMapper.toPrismaType(file.category);

    const upserted = await this.prisma.cvFile.upsert({
      where: { cvId_type: { cvId: file.cvId, type } },
      create: {
        id: file.id,
        cvId: file.cvId,
        type,
        path: file.path,
        filename: file.fileName,
        mimeType: file.mimeType,
        size: file.size,
        isPublished: file.isPublished,
      },
      update: {
        path: file.path,
        filename: file.fileName,
        mimeType: file.mimeType,
        size: file.size,
      },
    });

    return PrismaFileMapper.toDomain(upserted);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cvFile.delete({ where: { id } });
  }

  async updateManyStatusByCv(
    cvId: string,
    isPublished: boolean,
  ): Promise<void> {
    await this.prisma.cvFile.updateMany({
      where: { cvId },
      data: { isPublished },
    });
  }
}
