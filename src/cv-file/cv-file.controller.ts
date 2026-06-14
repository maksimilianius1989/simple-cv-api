import { Controller } from '@nestjs/common';
import { CvFileService } from './cv-file.service';

@Controller('cv-file')
export class CvFileController {
  constructor(private readonly cvFileService: CvFileService) {}
}
