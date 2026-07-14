import { AiDraftCvStatus as DomainStatus } from '@ai-draft/domain/enums/ai-draft-cv-status.enum';
import { AiDraftCvStatus as PrismaStatus } from '@prisma/client';

export class AiDraftCvStatusMapper {
  static toDomain(status: PrismaStatus): DomainStatus {
    switch (status) {
      case PrismaStatus.DRAFT:
        return DomainStatus.DRAFT;

      case PrismaStatus.GENERATION:
        return DomainStatus.GENERATION;

      case PrismaStatus.GENERATED:
        return DomainStatus.GENERATED;

      case PrismaStatus.FAILED:
        return DomainStatus.FAILED;

      case PrismaStatus.DELETED:
        return DomainStatus.DELETED;

      default:
        throw new Error(`Unknown persistance status: ${String(status)}`);
    }
  }

  static toPersistence(status: DomainStatus): PrismaStatus {
    const map: Record<DomainStatus, PrismaStatus> = {
      [DomainStatus.DRAFT]: PrismaStatus.DRAFT,
      [DomainStatus.GENERATION]: PrismaStatus.GENERATION,
      [DomainStatus.GENERATED]: PrismaStatus.GENERATED,
      [DomainStatus.FAILED]: PrismaStatus.FAILED,
      [DomainStatus.DELETED]: PrismaStatus.DELETED,
    };

    return map[status];
  }
}
