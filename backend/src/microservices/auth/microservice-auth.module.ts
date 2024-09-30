import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { MicroserviceAuthService } from './microservice-auth.service';
import * as process from 'process';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@rabbitmq:${process.env.RABBITMQ_PORT}`,
          ],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [MicroserviceAuthService],
  exports: [MicroserviceAuthService],
})
export class MicroserviceAuthModule {}
