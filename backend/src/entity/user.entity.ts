import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserDevices } from './user-devices.entity';
import { UserSecurityType } from '../types/user.type';
import { Comment } from './comment.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Column({ type: 'varchar', length: 250, nullable: false })
  password: string;

  @Column({
    type: 'jsonb',
    default: {
      login_time: null,
      login_attempts: null,
      is_block: false,
    },
  })
  security: UserSecurityType;

  @OneToMany(() => UserDevices, (device) => device.user)
  devices: UserDevices[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
