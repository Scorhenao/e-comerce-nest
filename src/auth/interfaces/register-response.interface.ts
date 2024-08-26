import { User } from 'src/users/entities/user.entity';

export interface RegisterResponse {
  user: User;
  token: string;
}
