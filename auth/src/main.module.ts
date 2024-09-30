import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';
import { join } from 'path';

import databaseConfig from '../data-source';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './lib/auth/auth.module';
import { ProtectModule } from './lib/protect/protect.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '.env'),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig.options),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_REFRESH_TOKEN },
    }),
    AuthModule,
    ProtectModule,
  ],
})
export class MainModule {}
