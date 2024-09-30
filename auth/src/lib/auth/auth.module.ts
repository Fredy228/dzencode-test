import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ProtectRefreshMiddleware } from '../../middlewares/protect-refresh.middleware';
import { UserAgentMiddleware } from '../../middlewares/user-agent.middleware';
import { UserRepository } from '../../repository/user.repository';
import { UserDevicesRepository } from '../../repository/user-devices.repository';
import { FileModule } from '../../services/file/file.module';

@Module({
  imports: [FileModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, UserDevicesRepository],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectRefreshMiddleware).forRoutes(
      {
        path: '/auth/refresh',
        method: RequestMethod.GET,
      },
      {
        path: '/auth/logout',
        method: RequestMethod.GET,
      },
    );

    consumer.apply(UserAgentMiddleware).forRoutes(
      {
        path: '/auth/register',
        method: RequestMethod.POST,
      },
      {
        path: '/auth/login',
        method: RequestMethod.POST,
      },
      {
        path: '/auth/refresh',
        method: RequestMethod.GET,
      },
    );
  }
}
