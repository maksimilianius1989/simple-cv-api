import { Injector } from '@nestjs/core/injector/injector';
import { ISharpImageProcessor } from '../../application/ports/sharp-image-processor.interfact';
import sharp from 'sharp';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SharpImageProcessor implements ISharpImageProcessor {
  async resize(imageBuffer: Buffer, width: number): Promise<Buffer> {
    return await sharp(imageBuffer).resize(width).png().toBuffer();
  }
}
