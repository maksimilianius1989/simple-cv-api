export class GenerateAiDraftCommand {
  constructor(
    public readonly userId: string,
    public readonly prompt: string,
  ) {}
}
