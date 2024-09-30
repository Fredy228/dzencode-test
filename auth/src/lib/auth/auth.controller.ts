import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JoiPipe } from 'nestjs-joi';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { LoginAuthDto, RegisterAuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { User } from '../../entity/user.entity';
import { UserDevices } from '../../entity/user-devices.entity';
import { FileValidatorPipe } from '../../pipe/validator-file.pipe';

const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @UsePipes(
    new FileValidatorPipe([
      {
        maxSize: 1024 * 10,
        mimetype: 'image',
        type: ['png', 'jpg', 'jpeg', 'webp'],
      },
    ]),
  )
  async register(
    @Req()
    req: Request,
    @Body(JoiPipe) registerBody: RegisterAuthDto,
    @UploadedFiles()
    files: {
      image?: Array<Express.Multer.File>;
    },
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const userAgent = req['useragent'];

    const createdUser = await this.authService.signUpCredentials(
      {
        ...registerBody,
        userAgent,
      },
      files?.image ? files?.image[0] : null,
    );
    res.cookie('refreshToken', createdUser.refreshToken, {
      httpOnly: true,
      maxAge: MAX_AGE,
    });
    return createdUser;
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Req()
    req: Request,
    @Body(JoiPipe) loginBody: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req['useragent'];
    const foundUser = await this.authService.signInCredentials({
      ...loginBody,
      userAgent,
    });
    res.cookie('refreshToken', foundUser.refreshToken, {
      httpOnly: true,
      maxAge: MAX_AGE,
    });
    return foundUser;
  }

  @Get('/refresh')
  @HttpCode(200)
  async refreshToken(
    @Req()
    req: Request & {
      user: User;
      currentDevice: UserDevices;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req['useragent'];

    const tokens = await this.authService.refreshToken(
      req.user,
      req.currentDevice,
      userAgent,
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: MAX_AGE,
    });
    return tokens;
  }

  @Get('/logout')
  @HttpCode(204)
  async logOut(
    @Req() req: Request & { user: User; currentDevice: UserDevices },
  ) {
    return this.authService.logout(req.currentDevice);
  }
}
