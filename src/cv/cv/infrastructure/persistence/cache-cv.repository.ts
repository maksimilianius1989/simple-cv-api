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

  async save(cv: Cv): Promise<void> {
    await this.origin.save(cv);

    try {
      const key = this.getListKey(cv.userId);
      await this.redis.del(key);
    } catch (error) {
      this.logger.warn(
        `Redis unavailable on DEL for user [${cv.userId}]. Skipping invalidation.`,
      );
    }
  }

  async exist(id: string): Promise<boolean> {
    return await this.origin.exist(id);
  }

  async isOwnerOfCv(userId: string, cvId: string): Promise<boolean> {
    return await this.origin.isOwnerOfCv(userId, cvId);
  }

  async getById(id: string): Promise<Cv | null> {
    return await this.origin.getById(id);
  }

  async getByIdAndUserId(id: string, userId: string): Promise<Cv | null> {
    return await this.origin.getByIdAndUserId(id, userId);
  }

  async getAllCvsByUserId(userId: string): Promise<Cv[]> {
    const key = this.getListKey(userId);

    try {
      const cachedData = await this.redis.get(key);
      if (cachedData) {
        const rawArray = JSON.parse(cachedData as string) as CvRawData[];
        return rawArray.map((item: CvRawData) => CvMapper.toDomain(item));
      }
    } catch (error) {
      this.logger.warn(
        `Redis unavailable on GET [${key}]. Falling back to DB.`,
      );
    }

    const cvs = await this.origin.getAllCvsByUserId(userId);
    if (cvs.length > 0) {
      try {
        await this.redis.set(
          key,
          JSON.stringify(cvs.map((cv) => CvMapper.toPersistence(cv))),
          'EX',
          this.TTL,
        );
      } catch (error) {
        this.logger.warn(
          `Redis unavailable on SET [${key}]. Falling back to DB.`,
        );
      }
    }

    return cvs;
  }

  private getListKey(userId: string): string {
    return `cvs:user:${userId}`;
  }
}
