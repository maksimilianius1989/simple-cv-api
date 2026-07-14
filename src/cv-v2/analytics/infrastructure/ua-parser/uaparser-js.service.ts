import {
  IParsedUserAgent,
  type IUserAgentParser,
} from '@analytics/application/ports/user-agent-parser.interface';
import { Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class UaParserJsService implements IUserAgentParser {
  parse(userAgentString: string): IParsedUserAgent {
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();
    return {
      browser: { name: result.browser?.name, version: result.browser?.version },
      os: { name: result.os?.name },
      device: { type: result.device?.type },
    };
  }
}
