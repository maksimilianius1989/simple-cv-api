import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
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

  async fetchByUser(user: User) {
    return await this.prismaService.userCvData.findMany({
      where: {
        isDeleted: false,
        userId: user.id,
      },
    });
  }
}
