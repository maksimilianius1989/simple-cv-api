import {
  FileType as PrismaFileType,
  CvFile as PrismaCvFile,
} from '@prisma/client';
import { StoredFile } from '../../domain/entities/stored-file.entity';
import { FileCategory } from '../../domain/enums/file-category.enum';

export class PrismaFileMapper {
  static toDomain(prismaFile: PrismaCvFile): StoredFile {
    return new StoredFile({
      id: prismaFile.id,
      cvId: prismaFile.cvId,
      category: PrismaFileMapper.domainMap[prismaFile.type],
      path: prismaFile.path,
      filename: prismaFile.filename,
      mimeType: prismaFile.mimeType,
      size: prismaFile.size ?? 0,
      isPublished: prismaFile.isPublished,
    });
  }

  static toPrismaType(category: FileCategory): PrismaFileType {
    const prismaType = PrismaFileMapper.prismaMap[category];
    if (!prismaType) {
      throw new Error(
        `PrismaFileMapper: Mapping for category "${category}" not found`,
      );
    }

    return prismaType;
  }

  private static readonly prismaMap: Record<FileCategory, PrismaFileType> = {
    [FileCategory.AVATAR]: PrismaFileType.AVATAR,
    [FileCategory.PDF]: PrismaFileType.PDF,
    [FileCategory.PREVIEW]: PrismaFileType.PREVIEW,
    [FileCategory.PREVIEW_THUMBNAIL]: PrismaFileType.PREVIEW_THUMBNAIL,
  };

  private static readonly domainMap: Record<PrismaFileType, FileCategory> = {
    [PrismaFileType.AVATAR]: FileCategory.AVATAR,
    [PrismaFileType.PDF]: FileCategory.PDF,
    [PrismaFileType.PREVIEW]: FileCategory.PREVIEW,
    [PrismaFileType.PREVIEW_THUMBNAIL]: FileCategory.PREVIEW_THUMBNAIL,
  };
}
