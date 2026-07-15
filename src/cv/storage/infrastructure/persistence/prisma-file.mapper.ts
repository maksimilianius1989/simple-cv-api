import {
  FileCategory as PrismaFileCategory,
  CvFile as PrismaCvFile,
} from '@prisma/client';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { FileCategory } from '@storage/domain/enums/file-category.enum';

export class PrismaFileMapper {
  static toDomain(prismaFile: PrismaCvFile): StoredFile {
    return new StoredFile({
      id: prismaFile.id,
      cvId: prismaFile.cvId,
      category: PrismaFileMapper.domainMap[prismaFile.category],
      path: prismaFile.path,
      filename: prismaFile.filename,
      mimeType: prismaFile.mimeType,
      size: prismaFile.size ?? 0,
      isPublished: prismaFile.isPublished,
      createdAt: prismaFile.createdAt,
      updatedAt: prismaFile.updatedAt ?? undefined,
    });
  }

  static toPrismaType(category: FileCategory): PrismaFileCategory {
    const prismaType = PrismaFileMapper.prismaMap[category];
    if (!prismaType) {
      throw new Error(
        `PrismaFileMapper: Mapping for category "${category}" not found`,
      );
    }

    return prismaType;
  }

  private static readonly prismaMap: Record<FileCategory, PrismaFileCategory> =
    {
      [FileCategory.AVATAR]: PrismaFileCategory.AVATAR,
      [FileCategory.PDF]: PrismaFileCategory.PDF,
      [FileCategory.PREVIEW]: PrismaFileCategory.PREVIEW,
      [FileCategory.PREVIEW_THUMBNAIL]: PrismaFileCategory.PREVIEW_THUMBNAIL,
    };

  private static readonly domainMap: Record<PrismaFileCategory, FileCategory> =
    {
      [PrismaFileCategory.AVATAR]: FileCategory.AVATAR,
      [PrismaFileCategory.PDF]: FileCategory.PDF,
      [PrismaFileCategory.PREVIEW]: FileCategory.PREVIEW,
      [PrismaFileCategory.PREVIEW_THUMBNAIL]: FileCategory.PREVIEW_THUMBNAIL,
    };
}
