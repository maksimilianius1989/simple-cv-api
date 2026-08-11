import { CvStatus as DomainStatus } from '@cv/domain/enums/cv-status.enum';
import { CvStatus as PrismaStatus } from '@prisma/client';

export class StatusMapper {
  static toDomain(prismaStatus: PrismaStatus): DomainStatus {
    const map: Record<PrismaStatus, DomainStatus> = {
      [PrismaStatus.CREATED]: DomainStatus.CREATED,
      [PrismaStatus.AVATAR_UPLOADED]: DomainStatus.AVATAR_UPLOADED,
      [PrismaStatus.PDF_GENERATED]: DomainStatus.PDF_GENERATED,
      [PrismaStatus.PREVIEW_GENERATED]: DomainStatus.PREVIEW_GENERATED,
      [PrismaStatus.PREVIEW_THUMBNAIL_GENERATED]:
        DomainStatus.PREVIEW_THUMBNAIL_GENERATED,
      [PrismaStatus.COMPLETED]: DomainStatus.COMPLETED,
      [PrismaStatus.FAILED]: DomainStatus.FAILED,
      [PrismaStatus.DELETED]: DomainStatus.DELETED,
    };

    return map[prismaStatus];
  }

  static toPersistance(status: DomainStatus): PrismaStatus {
    const map: Record<DomainStatus, PrismaStatus> = {
      [DomainStatus.CREATED]: PrismaStatus.CREATED,
      [DomainStatus.AVATAR_UPLOADED]: PrismaStatus.AVATAR_UPLOADED,
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
