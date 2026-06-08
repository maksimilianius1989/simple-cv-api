import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CvService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: {
    userId: string;
    title: string;
    userSummary: string;
    jsonSummary: object;
  }) {
    return await this.prismaService.userCvData.create({ data: { ...data } });
  }
}
