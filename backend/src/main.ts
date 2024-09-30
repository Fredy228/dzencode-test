import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'process';
import { join } from 'path';

import { MainModule } from './main.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: ['error', 'warn', 'log'],
    cors: {
      origin: [process.env.CLIENT_URL],
    },
  });

  app.setGlobalPrefix('/api/backend');
  app.useStaticAssets(join(process.cwd(), 'static'), {
    prefix: '/api/backend/static',
  });
  app.useGlobalFilters(new HttpExceptionFilter());

  const PORT = process.env.PORT_MAIN || 3000;

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
