import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { User } from '../../entity/user.entity';

@Controller('user')
export class UserController {
  constructor() {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getUser(@Req() req: Request & { user: User }) {
    return req.user;
  }
}
