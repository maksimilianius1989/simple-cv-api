import { Cv } from '../entities/cv.entity';

export const CV_REPOSITORY = Symbol('CV_REPOSITORY');

export interface ICvRepository {
  save(cv: Cv): Promise<void>;

  exist(id: string): Promise<boolean>;

  getById(id: string): Promise<Cv | null>;

  getCvByUserId(id: string, userId: string): Promise<Cv | null>;

  getCvsByUserId(userId: string): Promise<Cv[]>;

  getPublicCvBySlug(slug: string): Promise<Cv | null>;
}
