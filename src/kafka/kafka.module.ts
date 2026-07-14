import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'simple-cv-backend',
            brokers: [process.env.KAFKA_BROKERS || 'kafka:9094'],
            retry: {
              initialRetryTime: 1000,
              retries: 10,
            },
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class SharedKafkaModule {}
