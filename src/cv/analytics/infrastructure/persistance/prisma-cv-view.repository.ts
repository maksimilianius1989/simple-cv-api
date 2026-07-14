import { CvView } from '../../domain/entities/cv-view.entity';
import {
  ICountByVisitorAndDay,
  ICvViewRepository,
} from '../../domain/repositories/cv-view.repository.interface';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaCvViewMapper } from './prisma-cv-view.mapper';

@Injectable()
export class PrismaCvViewRepository implements ICvViewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(cvView: CvView): Promise<void> {
    await this.prismaService.cvView.create({
      data: PrismaCvViewMapper.toPersistance(cvView),
    });
  }

  async countByVisitorAndDay(props: ICountByVisitorAndDay): Promise<number> {
    const log = await this.prismaService.cvView.findMany({
      where: {
        visitorId: props.visitorId,
        cvId: props.cvId,
        viewedAt: { gte: props.dateFrom, lte: props.dateTo },
      },
      select: { id: true },
    });

    return log.length;
  }
}
