import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CvResponseDto } from './dtos/cv-response.dto';
import { GetPublicCvBySlugQuery } from '@cv/application/queries/get-public-cv-by-slug/get-public-cv-by-slug.query';
import { CvResponseMapper } from './mappers/cv-response.mapper';
import { CvWithFilesDto } from '@cv/application/queries/get-user-cvs/get-user-cvs.handler';

@Controller('public')
export class PublicCvController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':slug')
  async getPublicCvBySlug(@Param('slug') slug: string): Promise<CvResponseDto> {
    const cv = await this.queryBus.execute<
      GetPublicCvBySlugQuery,
      CvWithFilesDto
    >(new GetPublicCvBySlugQuery(slug));

    return CvResponseMapper.toResponse(cv);
  }
}
