import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';

export interface IAiProviderKeyProps {
  id: string;
  value: string;
  name: string;
  provider: AiProviderType;
  usageLimit: number;
  usedToday: number;
  usageDate: Date;
  isActive: boolean;
}

export class AiProviderKey {
  private readonly props: IAiProviderKeyProps;

  constructor(props: IAiProviderKeyProps) {
    this.props = { ...props };
  }

  needsReset(now: Date): boolean {
    return !this.isSameDay(now);
  }

  canBeUsed(now: Date): boolean {
    return (
      this.props.isActive &&
      this.props.usedToday < this.props.usageLimit &&
      this.isSameDay(now)
    );
  }

  private isSameDay(now: Date): boolean {
    return (
      this.props.usageDate.getUTCFullYear() === now.getUTCFullYear() &&
      this.props.usageDate.getUTCMonth() === now.getUTCMonth() &&
      this.props.usageDate.getUTCDate() === now.getUTCDate()
    );
  }

  get id(): string {
    return this.props.id;
  }

  get value(): string {
    return this.props.value;
  }

  get name(): string {
    return this.props.name;
  }

  get provider(): AiProviderType {
    return this.props.provider;
  }

  get usageLimit(): number {
    return this.props.usageLimit;
  }

  get usedToday(): number {
    return this.props.usedToday;
  }

  get usageDate(): Date {
    return this.props.usageDate;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }
}
