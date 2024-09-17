import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/@types/users';
import { UserDTO as UserResDto } from './dto/response/user.dto';
import { UserService } from '../users/user.service';
import {
  CompanyUserDto,
  UserDto as UserReqDto,
} from './dto/request/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthData } from '../auth/decorators/user.decorator';
import { AuthorizeResType } from '../auth/@types';
import { User } from '../users/entities/user.entity';
import { CustomValidationPipe } from '../common/CustomValidationPipe';
import { FindCompanyUsersReqDto } from './dto/request/find-company-users.dto';
import { FindCompanyUsersResDto } from './dto/response/find-company-users.dto';
import { FindSuperAdminsReqDto } from './dto/request/find-superadmins.dto';
import { FindSuperAdminsResDto } from './dto/response/find-superadmins.dto';
import { CompanyService } from '../company/company.service';
import { UserCountQueryDto } from './dto/request/user-count.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: FindSuperAdminsResDto,
    isArray: true,
  })
  @Roles(UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN)
  @Get('/superadmins')
  public async getSuperAdmins(
    @Query(CustomValidationPipe) filter: FindSuperAdminsReqDto,
    @UserAuthData() userAuthData: AuthorizeResType,
  ): Promise<FindSuperAdminsResDto> {
    const usersPage = await this.userService.findSuperAdmins(
      filter,
      userAuthData.userId,
    );
    return {
      meta: usersPage.meta,
      items: usersPage.items.map(
        (user) =>
          ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
          }) as UserResDto,
      ),
    };
  }

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: UserResDto,
  })
  @Roles(UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN)
  @Post('/superadmin')
  public async createSuperAdmin(@Body() body: UserReqDto): Promise<UserResDto> {
    const user = await this.userService.createSuperadmin(
      body.firstName,
      body.lastName,
      body.email,
      UserRole.SUPER_ADMIN,
    );
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: UserResDto,
  })
  @Roles(UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN)
  @Put('/superadmin/:id')
  public async updateSuperAdmin(
    @Body() body: UserReqDto,
    @Param('id') id: string,
  ): Promise<UserResDto> {
    await this.userService.updateUserNamesOrEmail(
      id,
      body.firstName,
      body.lastName,
      body.email,
    );
    return {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      id: id,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully returned.',
    type: UserResDto,
  })
  @Roles(UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN)
  @Get('/superadmin/:id')
  public async getSuperAdmin(@Param('id') id: string): Promise<UserResDto> {
    const user = await this.userService.findSuperadminById(id);
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.userId,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
    type: null,
  })
  @Roles(UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN)
  @Delete('/superadmin/:id')
  public async deleteSuperAdmin(@Param('id') id: string): Promise<void> {
    await this.userService.deleteSuperAdmin(id);
  }

  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: FindCompanyUsersResDto,
    isArray: true,
  })
  @Roles(UserRole.ADMIN, UserRole.SERVICE_ADVISER)
  @Get('/users')
  public async getUsersForCompany(
    @Query(CustomValidationPipe) filter: FindCompanyUsersReqDto,
    @UserAuthData() userAuthData: AuthorizeResType,
  ): Promise<FindCompanyUsersResDto> {
    const usersPage = await this.userService.findUsersByCompanyId(
      filter,
      userAuthData.userId,
      userAuthData.companyId,
    );
    return {
      meta: usersPage.meta,
      items: usersPage.items.map((user) => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        id: user.id,
      })),
    };
  }

  @ApiResponse({
    status: 201,
    description: 'The record created successfully',
    type: UserResDto,
  })
  @Roles(UserRole.ADMIN)
  @Post('/user')
  public async createUser(
    @Body() body: CompanyUserDto,
    @UserAuthData() userAuthData: AuthorizeResType,
  ): Promise<UserResDto> {
    const company = await this.companyService.getCompanyDetails(
      userAuthData.companyId,
    );
    const user: User = await this.userService.createUserForCompany(
      body.firstName,
      body.lastName,
      body.email,
      body.role,
      userAuthData.companyId,
      company.companyTenant.maxUsers,
    );
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      id: user.id,
    };
  }

  @ApiResponse({
    status: 201,
    description: 'The records created successfully',
    type: [UserResDto],
  })
  @Roles(UserRole.ADMIN)
  @Post('/user/bulk')
  public async createBulkUsers(
    @Body() body: CompanyUserDto[],
    @UserAuthData() userAuthData: AuthorizeResType,
  ): Promise<UserResDto[]> {
    const company = await this.companyService.getCompanyDetails(
      userAuthData.companyId,
    );
    const users: User[] = await this.userService.createBulkUserForCompany(
      body,
      userAuthData.companyId,
      company.companyTenant.maxUsers,
    );
    return users.map((user) => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      id: user.id,
    }));
  }

  @ApiResponse({
    status: 200,
    type: Number,
  })
  @Roles(UserRole.ADMIN)
  @Get('/count/me')
  public async getUserCountForMyCompany(
    @UserAuthData() userAuthData: AuthorizeResType,
    @Query(CustomValidationPipe) query: UserCountQueryDto,
  ): Promise<number> {
    return this.userService.getUserCountForCompany(
      userAuthData.companyId,
      query.role,
    );
  }

  @ApiResponse({
    status: 200,
    type: Number,
  })
  @Roles(UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN)
  @Get('/count/:companyId')
  public async getUserCount(
    @Param('companyId') companyId: string,
    @Query(CustomValidationPipe) query: UserCountQueryDto,
  ): Promise<number> {
    return this.userService.getUserCountForCompany(companyId, query.role);
  }

  @ApiResponse({
    status: 200,
    description: 'Found record',
    type: UserResDto,
  })
  @Roles(UserRole.ADMIN)
  @Get('/user/:id')
  public async getUserById(
    @Param('id') id: string,
    @UserAuthData() userAuthData: AuthorizeResType,
  ): Promise<UserResDto> {
    const user: User = await this.userService.findUserByIdForCompany(
      id,
      userAuthData.companyId,
    );
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      id: user.id,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Found record',
    type: UserResDto,
  })
  @Roles(UserRole.ADMIN)
  @Put('/user/:id')
  public async updateUser(
    @Body() body: CompanyUserDto,
    @Param('id') id: string,
    @UserAuthData() userAuthData: AuthorizeResType,
  ): Promise<UserResDto> {
    const company = await this.companyService.getCompanyDetails(
      userAuthData.companyId,
    );
    await this.userService.updateUserNamesOrEmailOrRoleForCompany(
      id,
      body.firstName,
      body.lastName,
      body.email,
      body.role,
      userAuthData.companyId,
      company.companyTenant.maxUsers,
    );
    return {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      id: id,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'deleted record',
    type: null,
  })
  @Roles(UserRole.ADMIN)
  @Delete('user/:id')
  public async deleteUser(
    @Param('id') id: string,
    @UserAuthData() userAuthData: AuthorizeResType,
  ): Promise<void> {
    await this.userService.deleteUserForCompany(id, userAuthData.companyId);
  }
}
