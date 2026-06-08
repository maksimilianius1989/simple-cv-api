import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CvService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: {
    userId: string;
    userSummary: string;
    jsonSummary: string;
  }) {
    return await this.prismaService.userCvData.create({ data: { ...data } });
  }
}
