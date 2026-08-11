import { AiDraftCvStatus as DomainStatus } from '@ai-draft/domain/enums/ai-draft-cv-status.enum';
import { AiDraftCvStatus as PrismaStatus } from '@prisma/client';

export class AiDraftCvStatusMapper {
  static toDomain(status: PrismaStatus): DomainStatus {
    const map: Record<PrismaStatus, DomainStatus> = {
      [PrismaStatus.CREATED]: DomainStatus.CREATED,
      [PrismaStatus.AVATAR_UPLOADED]: DomainStatus.AVATAR_UPLOADED,
      [PrismaStatus.GENERATING_CONTENT]: DomainStatus.GENERATING_CONTENT,
      [PrismaStatus.CONTENT_GENERATED]: DomainStatus.CONTENT_GENERATED,
      [PrismaStatus.PDF_GENERATED]: DomainStatus.PDF_GENERATED,
      [PrismaStatus.PREVIEW_GENERATED]: DomainStatus.PREVIEW_GENERATED,
      [PrismaStatus.PREVIEW_THUMBNAIL_GENERATED]:
        DomainStatus.PREVIEW_THUMBNAIL_GENERATED,
      [PrismaStatus.COMPLETED]: DomainStatus.COMPLETED,
      [PrismaStatus.FAILED]: DomainStatus.FAILED,
      [PrismaStatus.DELETED]: DomainStatus.DELETED,
    };

    return map[status];
  }

  static toPersistence(status: DomainStatus): PrismaStatus {
    const map: Record<DomainStatus, PrismaStatus> = {
      [DomainStatus.CREATED]: PrismaStatus.CREATED,
      [DomainStatus.AVATAR_UPLOADED]: PrismaStatus.AVATAR_UPLOADED,
      [DomainStatus.GENERATING_CONTENT]: PrismaStatus.GENERATING_CONTENT,
      [DomainStatus.CONTENT_GENERATED]: PrismaStatus.CONTENT_GENERATED,
      [DomainStatus.PDF_GENERATED]: PrismaStatus.PDF_GENERATED,
      [DomainStatus.PREVIEW_GENERATED]: PrismaStatus.PREVIEW_GENERATED,
      [DomainStatus.PREVIEW_THUMBNAIL_GENERATED]:
        PrismaStatus.PREVIEW_THUMBNAIL_GENERATED,
      [DomainStatus.COMPLETED]: PrismaStatus.COMPLETED,
      [DomainStatus.FAILED]: PrismaStatus.FAILED,
      [DomainStatus.DELETED]: PrismaStatus.DELETED,
    };

    return map[status];
  }
}
