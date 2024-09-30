import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { UserController } from './user.controller';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { MicroserviceAuthModule } from '../../microservices/auth/microservice-auth.module';

@Module({
  imports: [MicroserviceAuthModule],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes({
      path: '/user',
      method: RequestMethod.GET,
    });
  }
}
