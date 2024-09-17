import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { logAround } from 'src/app/logger/decorator/log-around';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: Repository<User>,
  ) {}

  @logAround()
  async createUser(userId: string, email: string) {
    const foundUser = await this.userRepository.findOne({ where: { userId } });
    if (foundUser) {
      return foundUser;
    }
    const user = new User();
    user.userId = userId;
    user.email = email;
    return this.userRepository.save(user);
  }
}
