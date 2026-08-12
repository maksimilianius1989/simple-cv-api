import { Cv } from '../entities/cv.entity';

export const CV_REPOSITORY = Symbol('CV_REPOSITORY');

export interface ICvRepository {
  save(cv: Cv): Promise<void>;

  exist(id: string): Promise<boolean>;

  isOwnerOfCv(userId: string, cvId: string): Promise<boolean>;

  getById(id: string): Promise<Cv | null>;

  getByIdAndUserId(id: string, userId: string): Promise<Cv | null>;

  getCvsByUserId(userId: string): Promise<Cv[]>;
}
