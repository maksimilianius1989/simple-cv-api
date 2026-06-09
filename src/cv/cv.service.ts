import { Injectable } from '@nestjs/common';
import type { User, UserCvData } from '@prisma/client';
import { PdfService } from 'src/pdf/pdf.service';
import { PreviewService } from 'src/pdf/preview.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CvService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pdfService: PdfService,
    private readonly previewService: PreviewService,
  ) {}

  async create(data: {
    userId: string;
    title: string;
    userSummary: string;
    jsonSummary: object;
  }) {
    return await this.prismaService.userCvData.create({ data: { ...data } });
  }

  async fetchByUser(user: User) {
    return await this.prismaService.userCvData.findMany({
      where: {
        isDeleted: false,
        userId: user.id,
      },
    });
  }

  async addPdfAndPreview(cv: UserCvData, pdf: Buffer) {
    const pdfPath = await this.pdfService.savePdf(cv.id, pdf);
    const previewPath = await this.previewService.generatePreviewFromPDF(
      cv.id,
      pdfPath,
    );

    await this.previewService.resizePreview(cv.id);

    await this.prismaService.userCvData.update({
      where: {
        id: cv.id,
      },
      data: {
        pdfPath,
        previewPath,
      },
    });
  }
}
