import { UserIdentity as DomainIdentity } from '@auth/domain/entities/identity.entity';
import { UserIdentity as PrismaIdentity } from '@prisma/client';
import { PrismaAuthProviderTypeMapper } from './prisma-auth-provider-type.mapper';

export class PrismaUserIdentityMapper {
  static toDomain(identity: PrismaIdentity): DomainIdentity {
    return new DomainIdentity({
      id: identity.id,
      userId: identity.userId,
      provider: PrismaAuthProviderTypeMapper.toDomain(identity.provider),
      providerId: identity.providerId,
      passwordHash: identity.passwordHash ?? undefined,
      createdAt: identity.createdAt,
      updatedAt: identity.updatedAt,
    });
  }

  static toPersistance(identity: DomainIdentity): PrismaIdentity {
    return {
      id: identity.id,
      userId: identity.userId,
      provider: PrismaAuthProviderTypeMapper.toPersistance(identity.provider),
      providerId: identity.providerId,
      passwordHash: identity.passwordHash ?? null,
      createdAt: identity.createdAt,
      updatedAt: identity.updatedAt ?? new Date(),
    };
  }
}
