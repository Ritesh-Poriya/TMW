import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { UserRole } from '../@types';
import { ROLES_KEY } from '../constants';
import { RolesGuard } from '../guards';

export const Roles = (...roles: UserRole[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
