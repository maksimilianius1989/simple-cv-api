import { Injectable } from '@nestjs/common';

@Injectable()
export class RetryPolicyService {
  async execute<T>(
    fn: () => Promise<T>,
    retries = 3,
    shouldRetry: (error: any) => boolean = () => true,
  ): Promise<T> {
    let lastError: any;

    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (e) {
        lastError = e;

        if (!shouldRetry(e)) {
          throw e;
        }

        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
      }
    }

    throw lastError;
  }
}
