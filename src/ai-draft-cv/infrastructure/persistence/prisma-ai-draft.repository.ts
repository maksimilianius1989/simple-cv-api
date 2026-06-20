import { AiDraftCvModule } from 'src/ai-draft-cv/cv-ref.module';
import { AiDraftCvRepository } from 'src/ai-draft-cv/domain/repositories/ai-draft-cv.repository';
import { PrismaService } from 'src/prisma/prisma.service';

export class PrismaAiDraftRepository implements AiDraftCvRepository {
  constructor(private prisma: PrismaService) {}
  create(draft: AiDraftCvModule): Promise<void> {
    this.prisma.aiDraftCv.create();
  }
  findById(id: string): Promise<AiDraftCvModule | null> {
    throw new Error('Method not implemented.');
  }
  save(draft: AiDraftCvModule): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
