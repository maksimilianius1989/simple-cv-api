import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CvView } from '@prisma/client';
import { PrismaService } from '@cv-prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async logCvView(cvId: string, req: Request): Promise<CvView> {
    const geo = geoip.lookup(req.ip);

    const parser = new UAParser(req.get('user-agent'));
    const result = parser.getResult();

    const visitorId = createHash('sha256')
      .update(
        `${req.ip}:${result.os.name}:${this.configService.getOrThrow('ANALYTICS_SALT')}`,
      )
      .digest('hex');

    return await this.prismaService.cvView.create({
      data: {
        cvId,
        visitorId,
        country: geo?.country,
        region: geo?.region,
        city: geo?.city,
        browser: result.browser.name,
        browserVersion: result.browser.version,
        os: result.os.name,
        device: result.device.type ?? 'desktop',
        referer: req.headers.referer,
      },
    });
  }

  async visitCountOFDayByVisitor(cvId: string, visitorId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const log = await this.prismaService.cvView.findMany({
      where: { visitorId, cvId, viewedAt: { gte: startOfDay, lte: endOfDay } },
      select: { id: true },
    });

    return log.length;
  }
}
