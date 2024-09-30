import { Module } from '@nestjs/common';

import { ProtectService } from './protect.service';
import { ProtectController } from './protect.controller';
import { UserRepository } from '../../repository/user.repository';

@Module({
  imports: [],
  providers: [ProtectService, UserRepository],
  controllers: [ProtectController],
})
export class ProtectModule {}
