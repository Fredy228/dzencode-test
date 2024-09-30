import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Details } from 'express-useragent';
import * as process from 'process';

import { LoginAuthDto, RegisterAuthDto } from './auth.dto';
import { TokenType } from '../../types/token.type';
import { CustomException } from '../../services/custom-exception';
import { checkPassword, hashPassword } from '../../services/hashPassword';
import { User } from '../../entity/user.entity';
import { UserDevices } from '../../entity/user-devices.entity';
import { UserRepository } from '../../repository/user.repository';
import { UserDevicesRepository } from '../../repository/user-devices.repository';
import { FileService } from '../../services/file/file.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UserRepository,
    private devicesRepository: UserDevicesRepository,
    private jwtService: JwtService,
    private fileService: FileService,
  ) {}

  async signInCredentials({
    email,
    password,
    userAgent,
    captcha,
  }: LoginAuthDto & { userAgent: Details }): Promise<User & TokenType> {
    const isVerifyCaptcha = await this.verifyCaptcha(captcha);
    if (!isVerifyCaptcha)
      throw new CustomException(HttpStatus.UNAUTHORIZED, `reCAPTCHA failed`);

    const user = await this.usersRepository.findOne({
      where: { email },
      relations: {
        devices: true,
      },
    });

    if (!user)
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        `Username or password is wrong`,
      );

    const deviceModel = `${userAgent.platform} ${userAgent.os} ${userAgent.browser}`;

    if (user?.security?.is_block)
      throw new CustomException(423, `User blocked`);

    const is_time_try =
      user?.security?.login_time &&
      new Date().getTime() - new Date(user.security.login_time).getTime() <
        3600 * 1000;
    if (is_time_try) {
      const time_try =
        new Date(user?.security?.login_time).getTime() +
        3600 * 1000 -
        new Date().getTime();
      throw new CustomException(
        425,
        `Try again in ${Math.round(time_try / 1000 / 60)} minutes`,
      );
    }

    const isValidPass = await checkPassword(password, user.password);

    if (!isValidPass) {
      if (
        user?.security?.login_attempts === 5 ||
        user?.security?.login_attempts === 10
      ) {
        user.security.login_time = new Date();
        await this.usersRepository.save(user);
      }

      if (user?.security?.login_attempts > 14) {
        user.security.is_block = true;
        await this.usersRepository.save(user);
      }

      user.security.login_attempts = user.security.login_attempts
        ? user.security.login_attempts + 1
        : 1;
      user.security.device_try = deviceModel;
      await this.usersRepository.save(user);

      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        `Username or password is wrong`,
      );
    }

    await this.usersRepository.update(user.id, {
      security: {
        login_attempts: null,
        login_time: null,
        is_block: false,
      },
    });

    await this.deleteOldSession(user.devices);

    const tokens = await this.addDeviceAuth(deviceModel, user);

    return { ...user, ...tokens, password: null };
  }

  async signUpCredentials(
    {
      email,
      password,
      name,
      userAgent,
      captcha,
    }: RegisterAuthDto & { userAgent: Details },
    image: Express.Multer.File | null,
  ): Promise<User & TokenType> {
    const isVerifyCaptcha = await this.verifyCaptcha(captcha);
    if (!isVerifyCaptcha)
      throw new CustomException(HttpStatus.UNAUTHORIZED, `reCAPTCHA failed`);

    const userFound = await this.usersRepository.findOneBy({ email });
    if (userFound)
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        `Such a user already exists`,
      );

    const deviceModel = `${userAgent.platform} ${userAgent.os} ${userAgent.browser}`;

    const hashPass = await hashPassword(password);

    let avatar_url = null;
    if (image)
      avatar_url = await this.fileService.saveImage(image, [], {
        width: 100,
        height: 100,
        fit: 'cover',
      });

    const newUser = this.usersRepository.create({
      email,
      password: hashPass,
      avatar_url,
      name,
      security: {
        is_block: false,
        login_attempts: null,
        login_time: null,
      },
    });
    await this.usersRepository.save(newUser);

    const tokens = await this.addDeviceAuth(deviceModel, newUser);

    return { ...newUser, ...tokens, password: undefined };
  }

  async refreshToken(
    user: User,
    currentDevice: UserDevices,
    userAgent: Details,
  ): Promise<TokenType> {
    const deviceModel = `${userAgent?.platform} ${userAgent?.os} ${userAgent?.browser}`;

    console.log('deviceModel', deviceModel);
    console.log('currentDevice.deviceModel', currentDevice.deviceModel);

    if (deviceModel !== currentDevice.deviceModel)
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        `Login from an untrusted device`,
      );

    if (user?.security?.is_block)
      throw new CustomException(423, `User blocked`);

    const newTokens = this.createToken(user);

    await this.devicesRepository.update(currentDevice.id, {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });

    return newTokens;
  }

  async logout(currentDevice: UserDevices): Promise<void> {
    await this.devicesRepository.delete(currentDevice);
    return;
  }

  async deleteOldSession(devices: UserDevices[]) {
    return Promise.all(
      devices.map(async (device) => {
        const decodedToken = await this.jwtService.decode(device.refreshToken);

        const currExp = decodedToken.exp * 1000;
        const currTime = new Date().getTime();

        if (currExp > currTime) return null;

        return await this.devicesRepository.delete(device);
      }),
    );
  }

  async addDeviceAuth(deviceModel: string, user: User): Promise<TokenType> {
    const tokens = this.createToken(user);
    const newDevice = this.devicesRepository.create({
      deviceModel: deviceModel ? deviceModel : null,
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    await this.devicesRepository.save(newDevice);

    return tokens;
  }

  createToken(user: User): TokenType {
    const payload = { email: user.email, id: user.id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRE_ACCESS_TOKEN,
    });
    const refreshToken = this.jwtService.sign(payload);
    return { accessToken, refreshToken };
  }

  async verifyCaptcha(token: string) {
    try {
      const res = await axios.get(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
      );

      return res.data?.success;
    } catch {
      return null;
    }
  }
}
