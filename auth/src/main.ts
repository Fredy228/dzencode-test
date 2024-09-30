import { NestFactory } from '@nestjs/core';
import * as process from 'process';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { MainModule } from './main.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: ['error', 'warn', 'log'],
    cors: {
      origin: [process.env.CLIENT_URL],
      credentials: true,
    },
  });

  app.setGlobalPrefix('/api/microservice');
  app.useStaticAssets(join(process.cwd(), 'static'), {
    prefix: '/api/microservice/static',
  });
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());

  const PORT = process.env.PORT_AUTH || 3001;

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

  app.connectMicroservice<MicroserviceOptions>({
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
  });

  await app.startAllMicroservices();
}
bootstrap();
