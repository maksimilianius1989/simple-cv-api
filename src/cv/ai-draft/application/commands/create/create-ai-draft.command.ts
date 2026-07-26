export class CreateAIDraftCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly prompt: string,
    public readonly avatar?: { originName: string; buffer: Buffer },
  ) {}
}
