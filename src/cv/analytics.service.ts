import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async logCvView(cvId: string, req: Request) {
    const geo = geoip.lookup(req.ip);

    const parser = new UAParser(req.get('user-agent'));
    const result = parser.getResult();

    const visitorId = createHash('sha256')
      .update(
        `${req.ip}:${result.os.name}:${this.configService.getOrThrow('ANALYTICS_SALT')}`,
      )
      .digest('hex');

    await this.prismaService.cvView.create({
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
}
