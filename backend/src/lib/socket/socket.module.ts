import { Module } from '@nestjs/common';
import { MicroserviceAuthModule } from '../../microservices/auth/microservice-auth.module';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [MicroserviceAuthModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
