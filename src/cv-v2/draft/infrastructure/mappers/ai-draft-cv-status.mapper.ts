import { AiDraftCvStatus as PrismaStatus } from '@prisma/client';
import { AiDraftCvStatus as DomainStatus } from '@draft/domain/enums/ai-draft-cv-status.enum';

export class AiDraftCvStatusMapper {
  static toDomain(status: PrismaStatus): DomainStatus {
    switch (status) {
      case PrismaStatus.DRAFT:
        return DomainStatus.DRAFT;

      case PrismaStatus.GENERATED:
        return DomainStatus.GENERATED;

      case PrismaStatus.FAILED:
        return DomainStatus.FAILED;

      default:
        throw new Error(`Unknown persistance status: ${String(status)}`);
    }
  }

  static toPersistence(status: DomainStatus): PrismaStatus {
    const map: Record<DomainStatus, PrismaStatus> = {
      [DomainStatus.DRAFT]: PrismaStatus.DRAFT,
      [DomainStatus.GENERATED]: PrismaStatus.GENERATED,
      [DomainStatus.FAILED]: PrismaStatus.FAILED,
    };

    return map[status];
  }
}
