import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { LogCvViewCommand } from './log-cv-view.command';
import { Inject } from '@nestjs/common';
import {
  CV_VIEW_REPOSITORY,
  type ICvViewRepository,
} from '@analytics/domain/repositories/cv-view.repository.interface';
import {
  GEO_IP_LOOKUP,
  type IGeoIpLookup,
} from '@analytics/application/ports/geo-ip-lookup.interface';
import {
  type IUserAgentParser,
  USER_AGENT_PARSER,
} from '@analytics/application/ports/user-agent-parser.interface';
import {
  HASH_GENERATOR,
  type IHashGenerator,
} from '@analytics/application/ports/hash-generator.interface';
import { CvView } from '@analytics/domain/entities/cv-view.entity';
import { CheckCvExistanceQuery } from '@cv/application/queries/check-cv-existance/check-cv-existance.query';

@CommandHandler(LogCvViewCommand)
export class LogCvViewHandler implements ICommandHandler<LogCvViewCommand> {
  constructor(
    @Inject(CV_VIEW_REPOSITORY as symbol)
    private readonly cvViewRepo: ICvViewRepository,
    @Inject(GEO_IP_LOOKUP as symbol)
    private readonly geoLookup: IGeoIpLookup,
    @Inject(USER_AGENT_PARSER as symbol)
    private readonly uaPareser: IUserAgentParser,
    @Inject(HASH_GENERATOR as symbol)
    private readonly hashGenerator: IHashGenerator,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: LogCvViewCommand): Promise<void> {
    const { cvId, ip, userAgent, referer } = command;

    await this.queryBus.execute(new CheckCvExistanceQuery(cvId));

    const geo = this.geoLookup.lookup(ip);
    const ua = this.uaPareser.parse(userAgent);

    const osName = ua.os.name ?? 'unknown';
    const visitorId = this.hashGenerator.generateVisitorId(ip, osName);

    const cvView = new CvView({
      id: crypto.randomUUID(),
      cvId,
      visitorId,
      country: geo?.country ?? null,
      region: geo?.region ?? null,
      city: geo?.city ?? null,
      browser: ua.browser?.name ?? null,
      browserVersion: ua.browser?.version ?? null,
      os: ua.os?.name ?? null,
      device: ua.device?.type ?? 'desktop',
      referer,
    });

    await this.cvViewRepo.save(cvView);
  }
}
