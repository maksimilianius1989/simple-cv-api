import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User as DomainUser } from '../../domain/entities/user.entity';
import { PrismaUserMapper } from './mappers/prisma-user.mapper';
import { Injectable } from '@nestjs/common';
import { PrismaAuthProviderTypeMapper } from './mappers/prisma-auth-provider-type.mapper';
import { AuthProviderType } from '@auth/domain/enums/auth-provider.enum';
import { PrismaUserIdentityMapper } from './mappers/prisma-user-identity.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<DomainUser | null> {
    const dbUser = await this.prisma.user.findUnique({
      where: { id },
      include: { identities: true },
    });
    if (!dbUser) return null;

    return PrismaUserMapper.toDomain(dbUser);
  }

  async findByProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<DomainUser | null> {
    const identityRecord = await this.prisma.userIdentity.findUnique({
      where: {
        provider_providerId: {
          provider: PrismaAuthProviderTypeMapper.toPersistance(provider),
          providerId,
        },
      },
      include: {
        user: {
          include: { identities: true },
        },
      },
    });

    if (!identityRecord) return null;

    return PrismaUserMapper.toDomain(identityRecord.user);
  }

  async save(user: DomainUser): Promise<void> {
    const persistanceUser = PrismaUserMapper.toPersistance(user);
    const domainIdentities = user.getIdentities();

    await this.prisma.$transaction(async (tx) => {
      await tx.user.upsert({
        where: { id: user.id },
        update: {
          email: persistanceUser.email,
          name: persistanceUser.name,
          acceptedTermsAt: persistanceUser.acceptedTermsAt,
          acceptedPrivacyAt: persistanceUser.acceptedPrivacyAt,
          termsVersion: persistanceUser.termsVersion,
          privacyVersion: persistanceUser.privacyVersion,
        },
        create: persistanceUser,
      });

      for (const domainIdentity of domainIdentities) {
        await tx.userIdentity.upsert({
          where: {
            provider_providerId: {
              provider: PrismaAuthProviderTypeMapper.toPersistance(
                domainIdentity.provider,
              ),
              providerId: domainIdentity.providerId,
            },
          },
          update: {
            passwordHash: domainIdentity.passwordHash ?? null,
          },
          create: PrismaUserIdentityMapper.toPersistance(domainIdentity),
        });
      }
    });
  }
}
