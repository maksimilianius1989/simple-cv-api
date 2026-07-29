export class CreatePaymentCommand {
  constructor(
    public readonly userId: string | null,
    public readonly amount: number,
  ) {}
}
