import { CvView } from '../../domain/entities/cv-view.entity';
import { CvView as PrismaCvView } from '@prisma/client';

export class PrismaCvViewMapper {
  static toDomain(prismaModel: PrismaCvView): CvView {
    return new CvView({
      id: prismaModel.id,
      cvId: prismaModel.cvId,
      visitorId: prismaModel.visitorId,
      country: prismaModel.country,
      region: prismaModel.region,
      city: prismaModel.city,
      browser: prismaModel.browser,
      browserVersion: prismaModel.browserVersion,
      os: prismaModel.os,
      device: prismaModel.device,
      referer: prismaModel.referer,
      viewedAt: prismaModel.viewedAt,
    });
  }

  static toPersistance(cvView: CvView): PrismaCvView {
    return {
      id: cvView.id,
      cvId: cvView.cvId,
      visitorId: cvView.visitorId,
      country: cvView.country,
      region: cvView.region,
      city: cvView.city,
      browser: cvView.browser,
      browserVersion: cvView.browserVersion,
      os: cvView.os,
      device: cvView.device,
      referer: cvView.referer,
      viewedAt: cvView.viewedAt,
    };
  }
}
