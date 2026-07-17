import { User as DomainUser } from '@auth/domain/entities/user.entity';
import {
  User as PrismaUser,
  UserIdentity as PrismaIdentity,
} from '@prisma/client';
import { PrismaUserIdentityMapper } from './prisma-user-identity.mapper';

export class PrismaUserMapper {
  static toPersistance(user: DomainUser): PrismaUser {
    return {
      id: user.id,
      email: user.email ?? null,
      name: user.name ?? null,
      acceptedTermsAt: user.acceptedTermsAt ?? null,
      acceptedPrivacyAt: user.acceptedPrivacyAt ?? null,
      termsVersion: user.termsVersion ?? null,
      privacyVersion: user.privacyVersion ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? new Date(),
    };
  }

  static toDomain(
    user: PrismaUser & { identities?: PrismaIdentity[] },
  ): DomainUser {
    const domainIdentities = user.identities?.map(
      (identity) => PrismaUserIdentityMapper.toDomain(identity) ?? [],
    );

    return new DomainUser(
      {
        id: user.id,
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        acceptedTermsAt: user.acceptedTermsAt ?? undefined,
        acceptedPrivacyAt: user.acceptedPrivacyAt ?? undefined,
        termsVersion: user.termsVersion ?? undefined,
        privacyVersion: user.privacyVersion ?? undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt ?? undefined,
      },
      domainIdentities,
    );
  }
}
