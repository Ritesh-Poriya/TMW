import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import {
  CompanyReqDto,
  FindCompanyDto,
  IgnoreUserCountQuery,
} from './dtos/requests';
import { CompanyMapper } from './mappers';
import { CompanyResDto, GetAllCompanyResDto } from './dtos/responses';
import { CustomValidationPipe } from '../common/CustomValidationPipe';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthorizeResType, UserRole } from '../auth/@types';
import { UserService } from '../users/user.service';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';
import { ErrorCode } from '../exceptions/error-codes';
import { UserAuthData } from '../auth/decorators';
import { Request } from 'express';

@ApiTags('Company')
@Controller()
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private userService: UserService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'The company has been successfully added.',
    type: CompanyResDto,
  })
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN)
  async create(
    @Body() createCompanyDto: CompanyReqDto,
    @Req() req: Request,
  ): Promise<CompanyResDto> {
    const userExist = await this.userService.checkIfUserExists(
      createCompanyDto.companyTenant.tenantMasterAdminEmail,
      req,
    );
    if (userExist) {
      throw CustomExceptionFactory.create(ErrorCode.EMAIL_IN_USE);
    }
    const company = CompanyMapper.toEntity(createCompanyDto);
    const companyEntity = await this.companyService.create(company);
    return CompanyMapper.toDto(companyEntity, null);
  }

  @ApiResponse({
    status: 200,
    description: 'The company has been successfully retrieved.',
    type: CompanyResDto,
  })
  @Get('/tenant/:tenantName')
  async findByTenantName(
    @Param('tenantName') tenantName: string,
    @Req() req: Request,
  ): Promise<CompanyResDto> {
    console.log('Reached to controller');
    const company = await this.companyService.findByTenantName(tenantName);
    const userCount = await this.userService.getUserCountByCompanyId(
      company.id,
      req,
    );
    return CompanyMapper.toDto(company, userCount);
  }

  @ApiResponse({
    status: 200,
    description: 'The company has been successfully retrieved.',
    type: GetAllCompanyResDto,
  })
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN)
  async findAll(
    @Query(CustomValidationPipe) query: FindCompanyDto,
    @Req() req: Request,
  ): Promise<GetAllCompanyResDto> {
    const companies = await this.companyService.findAll(query);
    return {
      meta: companies.meta,
      items: await Promise.all(
        companies.items.map(async (company) => {
          const userCount = query.ignoreUserCount
            ? null
            : await this.userService.getUserCountByCompanyId(company.id, req);
          return CompanyMapper.toDto(company, userCount);
        }),
      ),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The company has been successfully retrieved.',
    type: CompanyResDto,
  })
  @Get('/my')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.SERVICE_ADVISER)
  async getMyCompany(
    @UserAuthData() userAuthData: AuthorizeResType,
    @Query(CustomValidationPipe) query: IgnoreUserCountQuery,
    @Req() req: Request,
  ) {
    console.log(userAuthData);
    const company = await this.companyService.findById(userAuthData.companyId);
    const userCount = query.ignoreUserCount
      ? null
      : await this.userService.getMyCompanyUserCount(req);
    console.log(company);
    return CompanyMapper.toDto(company, userCount);
  }

  @ApiResponse({
    status: 200,
    description: 'The company has been successfully retrieved.',
    type: CompanyResDto,
  })
  @Get(':id')
  async getById(
    @Param('id') id: string,
    @UserAuthData() userAuthData: AuthorizeResType,
    @Query(CustomValidationPipe) query: IgnoreUserCountQuery,
    @Req() req: Request,
  ): Promise<CompanyResDto> {
    const company = await this.companyService.findById(id);
    const userCount = query.ignoreUserCount
      ? null
      : await this.userService.getUserCountByCompanyId(company.id, req);
    if (
      userAuthData.role !== UserRole.SUPER_ADMIN &&
      company.id !== userAuthData.companyId
    ) {
      throw CustomExceptionFactory.create(ErrorCode.FORBIDDEN);
    }
    return CompanyMapper.toDto(company, userCount);
  }

  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated.',
    type: CompanyResDto,
  })
  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN)
  @ApiOperation({
    description: 'This API is still unstable will be fixed later.',
  })
  async update(
    @Body() updateCompanyDto: CompanyReqDto,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const foundCompany = await this.companyService.findById(id);
    if (
      foundCompany &&
      updateCompanyDto.companyTenant.tenantMasterAdminEmail !==
        foundCompany.companyTenant.tenantMasterAdminEmail
    ) {
      const userExist = await this.userService.checkIfUserExists(
        updateCompanyDto.companyTenant.tenantMasterAdminEmail,
        req,
      );
      if (userExist) {
        throw CustomExceptionFactory.create(ErrorCode.EMAIL_IN_USE);
      }
    }
    const company = CompanyMapper.toEntity(updateCompanyDto);
    const companyEntity = await this.companyService.update(company, id);
    return CompanyMapper.toDto(companyEntity, null);
  }

  @ApiResponse({
    status: 200,
    description: 'The company has been successfully deleted.',
    type: null,
  })
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN)
  async delete(@Param('id') id: string) {
    return this.companyService.delete(id);
  }
}
