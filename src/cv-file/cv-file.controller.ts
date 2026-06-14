import { Controller, NotFoundException, Get, Param, Res } from '@nestjs/common';
import { CvFileService } from './cv-file.service';
import type { Response } from 'express';

@Controller('files')
export class CvFileController {
  constructor(private readonly cvFileService: CvFileService) {}

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.cvFileService.findById(id);

    if (!file?.isPublished) {
      throw new NotFoundException();
    }

    res.setHeader(
      'X-Accel-Redirect',
      `/${this.cvFileService.getPublicUrl(file.path)}`,
    );

    return res.status(200).end();
  }
}
