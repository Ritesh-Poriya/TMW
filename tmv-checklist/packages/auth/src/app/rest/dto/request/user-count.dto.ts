import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CompanyUserRole, UserRole } from 'src/app/users/@types/users';

export class UserCountQueryDto {
  @IsEnum(CompanyUserRole)
  @IsOptional()
  @ApiProperty({
    enum: CompanyUserRole,
    required: false,
  })
  role?: UserRole;
}
