import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TemplateService } from 'src/app/template/services/template.service';
import { TemplateReqDto } from '../dtos/request/template.dto';
import { TemplateMapper } from '../mapper/template.mapper';
import { ApiTags } from '@nestjs/swagger';
import {
  GetAllTemplateResDto,
  TemplateResDto,
} from '../dtos/response/template.dto';
import { CustomException } from 'src/app/exceptions/custom-exception';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { CustomValidationPipe } from 'src/app/common/CustomValidationPipe';
import { FindTemplateDto } from '../dtos/request/template-find.dto';
import { UserAuthData } from 'src/app/auth/decorators';
import { AuthorizeResType } from 'src/app/auth/@types';
import { UserRole } from 'src/app/users/@types';
import { Roles } from 'src/app/auth/decorators/roles.decorator';

@Controller()
@ApiTags('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post('/save')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MASTER_ADMIN)
  async create(
    @Body() body: TemplateReqDto,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<TemplateResDto> {
    const template = TemplateMapper.toEntity(body, user);
    template.isPublic = [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(
      user.role,
    );
    template.companyId = [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(
      user.role,
    )
      ? null
      : user.companyId;
    const result = await this.templateService.create(template, user);
    return TemplateMapper.toResDto(result);
  }

  @Get(':id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MASTER_ADMIN,
    UserRole.TECHNICIAN,
    UserRole.SERVICE_ADVISER,
  )
  async findOne(
    @Param('id') id: string,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<TemplateResDto> {
    const result = await this.templateService.findOneByIdOrThrow(
      id,
      CustomException.create(ErrorCode.TEMPLATE_NOT_FOUND),
    );
    if (
      !(
        result.isPublic ||
        result.companyId === user.companyId ||
        [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(user.role) ||
        result.companyId !== user.companyId
      )
    ) {
      throw CustomException.create(ErrorCode.TEMPLATE_NOT_FOUND);
    }
    return TemplateMapper.toResDto(result);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MASTER_ADMIN)
  async delete(
    @Param('id') id: string,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<void> {
    await this.templateService.delete(id, user);
  }

  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MASTER_ADMIN,
    UserRole.TECHNICIAN,
    UserRole.SERVICE_ADVISER,
  )
  async findAll(
    @Query(CustomValidationPipe) query: FindTemplateDto,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<GetAllTemplateResDto> {
    const result = await this.templateService.findAll({
      ...query,
      companyId: query.public ? null : user.companyId,
    });
    return TemplateMapper.toGetAllResDto(result);
  }
}
