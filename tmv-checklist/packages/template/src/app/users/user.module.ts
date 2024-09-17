import { Module } from '@nestjs/common';
import { userRepositoryProvider } from './repository/user.repository';
import { UserService } from './services/user.service';

@Module({
  providers: [userRepositoryProvider, UserService],
  exports: [UserService],
})
export class UserModule {}
