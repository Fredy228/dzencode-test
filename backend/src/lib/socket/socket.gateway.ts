import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

import { MicroserviceAuthService } from '../../microservices/auth/microservice-auth.service';

@WebSocketGateway({
  namespace: '/socket.io',
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly redis: Redis;

  constructor(
    private readonly microserviceAuthService: MicroserviceAuthService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) client.disconnect();

    try {
      const user = await this.microserviceAuthService.checkToken(token);
      client.data.user_id = user.id;
      this.redis.hmset(`user:${user.id}`, { ...user, socket_id: client.id });
    } catch {
      client.disconnect();
    }

    const redis_user = await this.redis.hgetall(`user:${client.data.user_id}`);
    console.log('redis_user', redis_user);
  }

  handleDisconnect(client: Socket) {
    const user_id = client.data.user_id;
    if (user_id) this.redis.del(`user:${user_id}`);
  }

  async sendNotification(user_id: number) {
    const redis_user = await this.redis.hgetall(`user:${user_id}`);
    if (!redis_user || !redis_user.socket_id) return;

    this.server.to(redis_user.socket_id).emit('notification', redis_user);
  }
}
