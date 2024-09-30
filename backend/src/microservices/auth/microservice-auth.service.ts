import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { User } from '../../entity/user.entity';

@Injectable()
export class MicroserviceAuthService {
  constructor(@Inject('AUTH_SERVICE') private authClientRMQ: ClientProxy) {}

  async checkToken(token: string): Promise<User> {
    return lastValueFrom(
      this.authClientRMQ.send({ cmd: 'check-auth' }, { token }),
    );
  }

  async findUser(id: number): Promise<User> {
    return lastValueFrom(this.authClientRMQ.send({ cmd: 'find-user' }, { id }));
  }
}
