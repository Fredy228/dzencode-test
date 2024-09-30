import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from '../../repository/comment.repository';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { MicroserviceAuthModule } from '../../microservices/auth/microservice-auth.module';
import { FileModule } from '../../services/file/file.module';
import { ValidateModule } from '../../services/validate/validate.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [MicroserviceAuthModule, FileModule, ValidateModule, SocketModule],
  providers: [CommentService, CommentRepository],
  controllers: [CommentController],
})
export class CommentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(
      {
        path: '/comment',
        method: RequestMethod.POST,
      },
      {
        path: '/comment/:comment_id',
        method: RequestMethod.GET,
      },
      {
        path: '/comment/:comment_id',
        method: RequestMethod.DELETE,
      },
    );
  }
}
