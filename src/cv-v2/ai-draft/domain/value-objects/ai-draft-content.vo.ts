export class AiDraftContent {
  constructor(
    public readonly name: string,
    public readonly position: string,
    public readonly summary: string,
    public readonly skills: string[],
  ) {
    if (!name && !position) {
      throw new Error('Invalid AI content');
    }
  }
}
