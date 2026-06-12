import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async logCvView(cvId: string, req: Request) {
    const ip = req.ip;
    const geo = geoip.lookup(req.ip);

    const parser = new UAParser(req.get('user-agent'));
    const result = parser.getResult();

    await this.prismaService.cvView.create({
      data: {
        cvId,
        ip,
        country: geo?.country,
        region: geo?.region,
        browser: result.browser.name,
        browserVersion: result.browser.version,
        city: geo?.city,
        referer: req.headers.referer,
        os: result.os.name,
        device: result.device.type ?? 'desktop',
      },
    });
  }
}
