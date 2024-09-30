import { User } from '../entity/user.entity';

export type ReqProtectedType = {
  user: User;
} & Request;
