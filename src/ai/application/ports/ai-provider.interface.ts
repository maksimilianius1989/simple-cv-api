export interface IAiProviderOptions {
  prompt: string;
  systemPrompt: string;
  responseSchema: Record<string, any>;
}

export interface IAiProvider {
  generate(options: IAiProviderOptions, apiKey?: string): Promise<string>;
}
