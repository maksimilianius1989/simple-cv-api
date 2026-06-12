import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { User, UserCvData } from '@prisma/client';
import { randomUUID } from 'crypto';
import { GeneratePdfDto } from 'src/pdf/dto/generate-pdf.dto';
import { PdfService } from 'src/pdf/pdf.service';
import { PreviewService } from 'src/pdf/preview.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QrService } from 'src/qr/qr.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CvService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pdfService: PdfService,
    private readonly previewService: PreviewService,
    private readonly qrService: QrService,
    private readonly configService: ConfigService,
  ) {}

  async create(data: {
    userId: string;
    title: string;
    userSummary: string;
    jsonSummary: object;
    coverLetter: string | null;
    avatar: string | null;
  }) {
    return await this.prismaService.userCvData.create({ data: { ...data } });
  }

  async deactivate(userId: string, id: string) {
    return await this.prismaService.userCvData.update({
      where: {
        id,
        userId,
      },
      data: {
        isDeactivated: true,
      },
    });
  }

  async getAllWithAnalyticsByUser(user: User) {
    const cvs = await this.prismaService.userCvData.findMany({
      where: {
        isDeactivated: false,
        userId: user.id,
      },
      orderBy: [{ createdAt: 'asc' }],
    });

    return Promise.all(
      cvs.map(async (cv) => {
        const [totalViews, uniqueVisitors, countries, cities, devices] =
          await Promise.all([
            this.prismaService.cvView.count({
              where: {
                cvId: cv.id,
              },
            }),

            this.prismaService.cvView.groupBy({
              by: ['visitorId'],
              where: {
                cvId: cv.id,
              },
            }),

            this.prismaService.cvView.groupBy({
              by: ['country'],
              where: {
                cvId: cv.id,
                country: {
                  not: null,
                },
              },
              _count: {
                country: true,
              },
              orderBy: {
                _count: {
                  country: 'desc',
                },
              },
              take: 5,
            }),

            this.prismaService.cvView.groupBy({
              by: ['city'],
              where: {
                cvId: cv.id,
                city: {
                  not: null,
                },
              },
              _count: {
                city: true,
              },
              orderBy: {
                _count: {
                  city: 'desc',
                },
              },
              take: 5,
            }),

            this.prismaService.cvView.groupBy({
              by: ['device'],
              where: {
                cvId: cv.id,
                device: {
                  not: null,
                },
              },
              _count: {
                device: true,
              },
              orderBy: {
                _count: {
                  device: 'desc',
                },
              },
            }),
          ]);

        return {
          ...cv,

          analytics: {
            totalViews,

            uniqueVisitors: uniqueVisitors.length,

            countries: countries.map((country) => ({
              country: country.country,
              views: country._count.country,
            })),

            cities: cities.map((city) => ({
              city: city.city,
              views: city._count.city,
            })),

            devices: devices.map((device) => ({
              device: device.device,
              views: device._count.device,
            })),
          },
        };
      }),
    );
  }

  async fetchNotPublisedByUser(user: User) {
    return await this.prismaService.userCvData.findMany({
      where: {
        isDeactivated: false,
        isPublished: false,
        userId: user.id,
      },
    });
  }

  async addPdfAndPreview(cv: UserCvData, pdf: Buffer) {
    const pdfUrl = await this.pdfService.savePdf(cv.id, pdf);
    const previewUrl = await this.previewService.generatePreviewFromPDF(
      cv.id,
      `${await this.pdfService.getDirPath()}/${cv.id}.pdf`,
    );

    await this.previewService.resizePreview(cv.id);

    await this.prismaService.userCvData.update({
      where: {
        id: cv.id,
      },
      data: {
        pdfPath: pdfUrl,
        previewPath: previewUrl,
      },
    });
  }

  async getPublishResume(slug: string) {
    const cv = await this.prismaService.userCvData.findUnique({
      where: {
        publicSlug: slug,
        isPublished: true,
        isDeactivated: false,
      },
    });

    if (!cv) {
      throw new NotFoundException();
    }

    if (cv.publishedUntil && cv.publishedUntil < new Date()) {
      await this.prismaService.userCvData.update({
        where: {
          id: cv.id,
        },
        data: {
          publicSlug: null,
          publishedAt: null,
          publishedUntil: null,
          isPublished: false,
        },
      });

      throw new NotFoundException();
    }

    await this.prismaService.userCvData.update({
      where: {
        id: cv.id,
      },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });

    return cv;
  }

  async publish(cvId: string, userId: string, days = 30) {
    const cv = await this.prismaService.userCvData.findFirst({
      where: {
        id: cvId,
        userId,
        isDeactivated: false,
      },
    });

    if (!cv) {
      throw new NotFoundException();
    }

    await this.prismaService.userCvData.update({
      where: {
        id: cvId,
      },
      data: {
        isPublished: true,
        publishedAt: new Date(),
        publishedUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        publicSlug: cv.publicSlug ?? randomUUID(),
      },
    });

    const cvPublicLink = `${this.configService.getOrThrow<string>('APP_DOMAIN')}/cv.html?slug=${cv.publicSlug}`;

    let dto: GeneratePdfDto = plainToInstance(GeneratePdfDto, cv.jsonSummary);
    dto.qr = await this.qrService.generate(cvPublicLink);
    dto.avatar = cv.avatar;

    const pdfBuffer = await this.pdfService.generatePdf(dto);

    return await this.addPdfAndPreview(cv, pdfBuffer);
  }

  async unpublish(cvId: string, userId: string) {
    return this.prismaService.userCvData.update({
      where: {
        id: cvId,
        userId,
        isDeactivated: false,
      },
      data: {
        isPublished: false,
        publishedUntil: null,
      },
    });
  }
}
