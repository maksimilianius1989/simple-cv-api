import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCvDto } from './dtos/create-cv.dto';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { CreateCvCommand } from '@cv/application/commands/create-cv/create-cv.command';

@Controller('cvs')
export class CvController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
