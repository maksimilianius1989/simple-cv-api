import { Injectable } from '@nestjs/common';
import { PrismaFileMapper } from './prisma-file.mapper';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { IFileRepository } from '@storage/domain/repositories/file.repository.interface';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { FileCategory } from '@storage/domain/enums/file-category.enum';

@Injectable()
export class PrismaFIleRepository implements IFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCvIds(cvIds: string[]): Promise<StoredFile[]> {
    const files = await this.prisma.cvFile.findMany({
      where: { cvId: { in: cvIds } },
    });

    return files.map((file) => PrismaFileMapper.toDomain(file));
  }

  async findById(id: string): Promise<StoredFile | null> {
    const file = await this.prisma.cvFile.findUnique({ where: { id } });
    return file ? PrismaFileMapper.toDomain(file) : null;
  }

  async findPublishedById(id: string): Promise<StoredFile | null> {
    const file = await this.prisma.cvFile.findUnique({
      where: { id, isPublished: true },
    });
    return file ? PrismaFileMapper.toDomain(file) : null;
  }

  async findByCvAndCategory(
    cvId: string,
    category: FileCategory,
  ): Promise<StoredFile | null> {
    const file = await this.prisma.cvFile.findFirst({
      where: { cvId, category: PrismaFileMapper.toPrismaType(category) },
    });
    return file ? PrismaFileMapper.toDomain(file) : null;
  }

  async findByCv(cvId: string): Promise<StoredFile[]> {
    const files = await this.prisma.cvFile.findMany({ where: { cvId } });
    return files.map((file) => PrismaFileMapper.toDomain(file));
  }

  async save(file: StoredFile): Promise<StoredFile> {
    const category = PrismaFileMapper.toPrismaType(file.category);

    const upserted = await this.prisma.cvFile.upsert({
      where: { cvId_category: { cvId: file.cvId, category } },
      create: {
        id: file.id,
        cvId: file.cvId,
        category,
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

  async deleteByCvId(cvId: string): Promise<void> {
    await this.prisma.cvFile.deleteMany({ where: { cvId } });
  }

  async updateManyStatusByCvId(
    cvId: string,
    isPublished: boolean,
  ): Promise<void> {
    await this.prisma.cvFile.updateMany({
      where: { cvId },
      data: { isPublished },
    });
  }
}
