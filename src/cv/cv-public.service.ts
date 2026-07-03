import { Injectable } from '@nestjs/common';
import { CvService } from './cv.service';
import { AnalyticsService } from './analytics.service';
import type { Request } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CvEvents } from './cv.events';
import { CvFileService } from '../cv-file/cv-file.service';

@Injectable()
export class CvPublicService {
  constructor(
    private readonly cvService: CvService,
    private readonly analyticsService: AnalyticsService,
    private readonly eventEmmiter: EventEmitter2,
    private readonly fileService: CvFileService,
  ) {}

  async publishResume(slug: string, req: Request) {
    const cv = await this.cvService.getPublishResume(slug);
    const log = await this.analyticsService.logCvView(cv.id, req);
    const visitCount = await this.analyticsService.visitCountOFDayByVisitor(
      cv.id,
      log.visitorId,
    );

    if (visitCount === 1) {
      this.eventEmmiter.emit(CvEvents.EVENT_CV_VIEWD_UNIQ, {
        userId: cv.userId,
        title: cv.title,
        city: log.city,
        viewedAt: log.viewedAt,
      });
    }

    const cvFiles = await this.fileService.fetchByCv(cv.id);

    const files = cvFiles.reduce(
      (acc, file) => {
        acc[file.type] = file.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    return {
      ...cv,
      files,
    };
  }
}
