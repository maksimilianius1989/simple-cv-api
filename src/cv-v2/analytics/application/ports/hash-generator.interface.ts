export const HASH_GENERATOR = Symbol('HASH_GENERATOR');
export interface IHashGenerator {
  generateVisitorId(ip: string, osName: string): string;
}
