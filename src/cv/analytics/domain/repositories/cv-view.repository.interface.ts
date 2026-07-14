import { CvView } from '../entities/cv-view.entity';

export interface ICountByVisitorAndDay {
  cvId: string;
  visitorId: string;
  dateFrom: Date;
  dateTo: Date;
}

export const CV_VIEW_REPOSITORY = Symbol('CV_VIEW_REPOSITORY');
export interface ICvViewRepository {
  save(cvView: CvView): Promise<void>;

  countByVisitorAndDay(props: ICountByVisitorAndDay): Promise<number>;
}
