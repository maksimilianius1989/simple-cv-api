import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type User, type Cv, FileType, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';
import { CvContent } from './types/cv-content.type';
import { PdfService } from '../pdf/pdf.service';
import { PreviewService } from '../pdf/preview.service';
import { QrService } from '../qr/qr.service';
import { CvFileService } from '../cv-file/cv-file.service';
import { isDev } from '@shared/utils/is-dev.utils';
import { GeneratePdfDto } from '../pdf/dto/generate-pdf.dto';
import { PrismaService } from '@cv-prisma/prisma.service';

@Injectable()
export class CvService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pdfService: PdfService,
    private readonly previewService: PreviewService,
    private readonly qrService: QrService,
    private readonly configService: ConfigService,
    private readonly fileService: CvFileService,
  ) {}

  async create(
    userId: string,
    title: string,
    cvContent: CvContent,
    coverLetter?: string,
  ) {
    const content: Prisma.InputJsonValue = JSON.parse(
      JSON.stringify(cvContent),
    );

    return await this.prismaService.cv.create({
      data: {
        userId,
        title,
        content,
        coverLetter,
      },
    });
  }

  async deactivate(userId: string, id: string) {
    return await this.prismaService.cv.update({
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
    const cvs = await this.prismaService.cv.findMany({
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
    return await this.prismaService.cv.findMany({
      where: {
        isDeactivated: false,
        isPublished: false,
        userId: user.id,
      },
    });
  }

  async addPdfAndPreview(cv: Cv, pdf: Buffer) {
    await this.pdfService.savePdf(cv.userId, cv.id, pdf);
    await this.previewService.generatePreview(cv.userId, cv.id);
    await this.previewService.generatePreviewThumbnail(cv.userId, cv.id);
  }

  async getPublishResume(slug: string) {
    const cv = await this.prismaService.cv.findUnique({
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
      await this.prismaService.cv.update({
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

    await this.prismaService.cv.update({
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
    let cv = await this.prismaService.cv.findFirst({
      where: {
        id: cvId,
        userId,
        isDeactivated: false,
      },
    });

    if (!cv) {
      throw new NotFoundException();
    }

    cv = await this.prismaService.cv.update({
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
    const avatarFile = await this.fileService.fetchByCvAndType(
      cv.id,
      FileType.AVATAR,
    );

    let cvAvatarLink: string | null = null;

    if (avatarFile) {
      const domain = isDev(this.configService)
        ? `http://simple-cv-nestjs`
        : this.configService.getOrThrow<string>('API_DOMAIN');
      cvAvatarLink = `${domain}/files/${avatarFile?.id}`;
    }

    const dto: GeneratePdfDto = plainToInstance(GeneratePdfDto, cv.content);
    dto.qr = await this.qrService.generate(cvPublicLink);
    dto.avatar = cvAvatarLink;

    const pdfBuffer = await this.pdfService.generatePdf(dto);

    return await this.addPdfAndPreview(cv, pdfBuffer);
  }

  async unpublish(cvId: string, userId: string) {
    return this.prismaService.cv.update({
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

  async getById(id: string) {
    const cv = await this.prismaService.cv.findUnique({ where: { id } });

    if (!cv) {
      throw new NotFoundException();
    }

    return cv;
  }
}
