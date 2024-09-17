import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/user.module';
import { CryptoModule } from '../crypt/crypto.module';
import { CryptoController } from './crypto.controller';
import { BlockingModule } from '../blocking/blocking.module';
import { HostModule } from '../host/host.module';
import { UsersController } from './users.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CryptoModule,
    BlockingModule,
    HostModule,
    CompanyModule,
  ],
  providers: [Logger],
  controllers: [AuthController, CryptoController, UsersController],
})
export class RestModule {}
