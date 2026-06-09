import { Injectable } from '@nestjs/common';
import type { User, UserCvData } from '@prisma/client';
import { PdfService } from 'src/pdf/pdf.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CvService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pdfService: PdfService,
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

  async addPdf(cv: UserCvData, pdf: Buffer) {
    const pdfPath = await this.pdfService.savePdf(cv.id, pdf);

    await this.prismaService.userCvData.update({
      where: {
        id: cv.id,
      },
      data: {
        pdfPath: pdfPath,
      },
    });
  }
}
