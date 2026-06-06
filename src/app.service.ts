import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getGreetsYou(): string {
    return '<a href="https://simple-cv.life">Simple CV greets you!</a>';
  }
}
