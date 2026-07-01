import { Cv } from '../entities/cv';

export const CV_REPOSITORY = Symbol('CV_REPOSITORY');

export interface ICvRepository {
  save(cv: Cv): Promise<void>;
}
