import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { UserDevices } from '../entity/user-devices.entity';

@Injectable()
export class UserDevicesRepository extends Repository<UserDevices> {
  constructor(private dataSource: DataSource) {
    super(UserDevices, dataSource.createEntityManager());
  }
}
