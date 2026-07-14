import { IHashGenerator } from '../../application/ports/hash-generator.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

@Injectable()
export class CryptoHashService implements IHashGenerator {
  constructor(private readonly configService: ConfigService) {}

  generateVisitorId(ip: string, osName: string): string {
    const salt = this.configService.getOrThrow<string>('ANALYTICS_SALT');
    return createHash('sha256').update(`${ip}:${osName}:${salt}`).digest('hex');
  }
}
