import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CustomRMQException } from '../../services/custom-exception';
import { UserRepository } from '../../repository/user.repository';
import { User } from '../../entity/user.entity';

@Injectable()
export class ProtectService {
  constructor(
    private usersRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async checkAuth(token: string): Promise<User> {
    if (!token)
      throw new CustomRMQException(HttpStatus.BAD_REQUEST, 'Not token');

    let decodedToken: { id: any };
    try {
      decodedToken = await this.jwtService.verify(token);
    } catch (error) {
      console.error(error);
      throw new CustomRMQException(HttpStatus.UNAUTHORIZED, 'Not authorized');
    }

    const currentUser = await this.usersRepository.findOne({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        name: true,
        avatar_url: true,
        email: true,
        security: {},
      },
    });

    if (!currentUser)
      throw new CustomRMQException(HttpStatus.UNAUTHORIZED, 'Not authorized');

    return currentUser;
  }

  async findUser(id: number): Promise<User> | null {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      select: {
        avatar_url: true,
        name: true,
        email: true,
      },
    });
  }
}
