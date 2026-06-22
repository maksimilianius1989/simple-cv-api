export enum AiProviderType {
  GEMINI = 'GEMINI',
  OLLAMA = 'OLLAMA',
}

export class AiProviderKey {
  constructor(
    public readonly id: string,
    public readonly value: string,
    public readonly provider: AiProviderType,
    public readonly usageLimit: number,
    public readonly usedToday: number,
    public readonly usageDate: Date,
    public readonly isActive: boolean,
  ) {}

  canBeUsed(now: Date): boolean {
    return (
      this.isActive &&
      this.usedToday < this.usageLimit &&
      this.isSameDay(this.usageDate, now)
    );
  }

  private isSameDay(usageDate: Date, now: Date): boolean {
    return (
      usageDate.getUTCFullYear() === now.getUTCFullYear() &&
      usageDate.getUTCMonth() === now.getUTCMonth() &&
      usageDate.getUTCDay() === now.getUTCDay()
    );
  }
}
