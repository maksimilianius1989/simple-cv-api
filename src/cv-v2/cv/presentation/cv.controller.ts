import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCvDto } from './dtos/create-cv.dto';
import { CreateCvCommand } from '@cv/application/commands/create-cv/create-cv.command';
import { Authorization } from '../../../auth/decorators/authorization.decorator';
import { Authorized } from '../../../auth/decorators/authorized.decorator';
import { Cv } from '@cv/domain/entities/cv.entity';
import { GetCvByIdQuery } from '@cv/application/queries/get-cv-by-id/get-cv-by-id.query';
import { FindOneCvDto } from './dtos/find-one-cv.dto';

@Controller()
export class CvController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Authorization()
  async createCv(
    @Authorized('id') userId: string,
    @Body() dto: CreateCvDto,
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateCvCommand(userId, dto.name, dto),
    );
  }

  @Get(':id')
  @Authorization()
  async getCv(@Param() params: FindOneCvDto): Promise<Cv> {
    return await this.queryBus.execute(new GetCvByIdQuery(params.id));
  }
}
