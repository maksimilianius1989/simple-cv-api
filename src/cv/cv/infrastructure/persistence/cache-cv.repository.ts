import { Cv } from '@cv/domain/entities/cv.entity';
import { ICvRepository } from '@cv/domain/repositories/cv.repository.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaCvRepository } from './prisma-cv.repository';
import { REDIS_CLIENT } from '@shared/infrastructure/redis/redis.module';
import Redis from 'ioredis';
import { CvMapper, CvRawData } from './cv.mapper';

@Injectable()
export class CacheCvRepository implements ICvRepository {
  private readonly TTL = 3600;
  private readonly logger = new Logger(CacheCvRepository.name);

  constructor(
    private readonly origin: PrismaCvRepository,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private keys = {
    bySlug: (slug: string) => `cvs:slug:${slug}`,
    byId: (id: string) => `cvs:id:${id}`,
    userVersion: (userId: string) => `cvs:user:${userId}:version`,
    byUserAndId: (userId: string, id: string) => `cvs:user:${userId}:id:${id}`,
    userList: (userId: string, version: number) =>
      `cvs:user:${userId}:v${version}:list`,
  };

  async getPublicCvBySlug(slug: string): Promise<Cv | null> {
    const key = this.keys.bySlug(slug);

    try {
      const cached = await this.redis.get(key);
      if (cached) return CvMapper.toDomain(JSON.parse(cached) as CvRawData);
    } catch (error) {
      this.logger.warn(`Redis GET failed [${key}]`);
    }

    const cv = await this.origin.getPublicCvBySlug(slug);
    if (cv) {
      await this.safeSet(key, CvMapper.toPersistence(cv));
    }

    return cv;
  }

  async save(cv: Cv): Promise<void> {
    await this.origin.save(cv);

    try {
      await this.redis.del(this.keys.byId(cv.id));
      if (cv.publicSlug) {
        await this.redis.del(this.keys.bySlug(cv.publicSlug));
      }

      await this.redis.incr(this.keys.userVersion(cv.userId));
    } catch (error) {
      this.logger.warn(
        `Redis unavailable on DEL for user [${cv.userId}]. Skipping invalidation.`,
      );
    }
  }

  async exist(id: string): Promise<boolean> {
    return await this.origin.exist(id);
  }

  async getById(id: string): Promise<Cv | null> {
    const key = this.keys.byId(id);

    try {
      const cached = await this.redis.get(key);
      if (cached) return CvMapper.toDomain(JSON.parse(cached) as CvRawData);
    } catch (error) {
      this.logger.warn(`Redis GET failed [${key}]`);
    }

    const cv = await this.origin.getById(id);
    if (cv) {
      await this.safeSet(key, CvMapper.toPersistence(cv));
    }

    return cv;
  }

  async getCvByUserId(id: string, userId: string): Promise<Cv | null> {
    const key = this.keys.byUserAndId(userId, id);

    try {
      const cached = await this.redis.get(key);
      if (cached) return CvMapper.toDomain(JSON.parse(cached) as CvRawData);
    } catch (error) {
      this.logger.warn(`Redis GET failed [${key}]`);
    }

    const cv = await this.origin.getCvByUserId(id, userId);
    if (cv) {
      await this.safeSet(key, CvMapper.toPersistence(cv));
    }

    return cv;
  }

  async getCvsByUserId(userId: string): Promise<Cv[]> {
    const version = await this.getVersionByUser(userId);
    const key = this.keys.userList(userId, version);

    try {
      const cachedData = await this.redis.get(key);
      if (cachedData) {
        const rawArray = JSON.parse(cachedData) as CvRawData[];
        return rawArray.map((item: CvRawData) => CvMapper.toDomain(item));
      }
    } catch (error) {
      this.logger.warn(`Redis unavailable on GET [${key}].`);
    }

    const cvs = await this.origin.getCvsByUserId(userId);
    if (cvs.length > 0) {
      await this.safeSet(
        key,
        cvs.map((cv) => CvMapper.toPersistence(cv)),
      );
    }

    return cvs;
  }

  private async getVersionByUser(userId: string): Promise<number> {
    const key = this.keys.userVersion(userId);

    try {
      const version = await this.redis.get(key);
      return version ? parseInt(version, 10) : 1;
    } catch (error) {
      return 1;
    }
  }

  private async safeSet(key: string, data: any): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(data), 'EX', this.TTL);
    } catch (error) {
      this.logger.warn(`Redis unavailable on SET [${key}].`);
    }
  }

  async findScheduledCvs(): Promise<Cv[]> {
    return await this.origin.findScheduledCvs();
  }

  async findExpiredCvs(): Promise<Cv[]> {
    return await this.origin.findExpiredCvs();
  }
}
