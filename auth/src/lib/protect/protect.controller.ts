import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProtectService } from './protect.service';
import { User } from '../../entity/user.entity';

@Controller('protect')
export class ProtectController {
  constructor(private readonly protectService: ProtectService) {}

  @MessagePattern({ cmd: 'check-auth' })
  async checkAuthorization(@Payload() event: { token: string }): Promise<User> {
    return this.protectService.checkAuth(event.token);
  }

  @MessagePattern({ cmd: 'find-user' })
  async findUser(@Payload() event: { id: number }): Promise<User> | null {
    return this.protectService.findUser(event.id);
  }
}
