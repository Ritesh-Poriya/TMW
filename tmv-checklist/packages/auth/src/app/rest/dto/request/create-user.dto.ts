import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CompanyUserRole, UserRole } from 'src/app/users/@types/users';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  email: string;
}

export class CompanyUserDto extends UserDto {
  @IsEnum(CompanyUserRole)
  @ApiProperty({ enum: CompanyUserRole })
  role: UserRole;
}
