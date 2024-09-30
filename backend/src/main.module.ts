import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import * as process from 'process';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { CommentModule } from './lib/comment/comment.module';

import databaseConfig from './../data-source';
import { UserModule } from './lib/user/user.module';
import { SocketModule } from './lib/socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '.env'),
      isGlobal: true,
    }),
    RedisModule.forRoot({
      config: {
        host: 'redis',
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    TypeOrmModule.forRoot(databaseConfig.options),
    CommentModule,
    UserModule,
    SocketModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
