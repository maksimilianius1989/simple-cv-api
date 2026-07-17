import { AuthProviderType as DomainAuthProviderType } from '@auth/domain/enums/auth-provider.enum';
import { AuthProviderType as PrismaAuthProviderType } from '@prisma/client';

export class PrismaAuthProviderTypeMapper {
  static toDomain(type: PrismaAuthProviderType): DomainAuthProviderType {
    switch (type) {
      case PrismaAuthProviderType.LOCAL:
        return DomainAuthProviderType.LOCAL;

      case PrismaAuthProviderType.GOOGLE:
        return DomainAuthProviderType.GOOGLE;

      case PrismaAuthProviderType.TELEGRAM:
        return DomainAuthProviderType.TELEGRAM;

      default:
        throw new Error(
          `Unknown persistance Auth provider type: ${String(type)}`,
        );
    }
  }

  static toPersistance(type: DomainAuthProviderType): PrismaAuthProviderType {
    const map: Record<DomainAuthProviderType, PrismaAuthProviderType> = {
      [DomainAuthProviderType.LOCAL]: PrismaAuthProviderType.LOCAL,
      [DomainAuthProviderType.GOOGLE]: PrismaAuthProviderType.GOOGLE,
      [DomainAuthProviderType.TELEGRAM]: PrismaAuthProviderType.TELEGRAM,
    };

    return map[type];
  }
}
