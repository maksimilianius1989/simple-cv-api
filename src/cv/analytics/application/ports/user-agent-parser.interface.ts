export interface IParsedUserAgent {
  browser: { name?: string; version?: string };
  os: { name?: string };
  device: { type?: string };
}

export const USER_AGENT_PARSER = Symbol('USER_AGENT_PARSER');
export interface IUserAgentParser {
  parse(userAgentString: string): IParsedUserAgent;
}
