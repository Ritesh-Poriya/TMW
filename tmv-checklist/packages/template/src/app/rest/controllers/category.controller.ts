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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from 'src/app/template/services/category.service';
import { GetAllCategoriesAPIResponse, CategoryResDto } from '../dtos/response';
import { CategoryMapper } from '../mapper';
import { CategoryReqDto } from '../dtos/request';
import { CustomException } from 'src/app/exceptions/custom-exception';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { FindCategoryDto } from '../dtos/request/category-find.dto';
import { CustomValidationPipe } from 'src/app/common/CustomValidationPipe';
import { UserAuthData } from 'src/app/auth/decorators';
import { UserRole } from 'src/app/users/@types/users';
import { User as UserEntity } from '../../users/entity/user.entity';
import { AuthorizeResType } from 'src/app/auth/@types';
import { FindCategoryOptions } from 'src/app/template/@types';
import { PaginationFilter } from 'src/app/common/pagination';
import { Roles } from 'src/app/auth/decorators/roles.decorator';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MASTER_ADMIN,
    UserRole.TECHNICIAN,
    UserRole.SERVICE_ADVISER,
  )
  @ApiResponse({
    status: 200,
    description: 'Return all categories',
    type: GetAllCategoriesAPIResponse,
  })
  async findAll(
    @Query(CustomValidationPipe)
    query: FindCategoryDto,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<GetAllCategoriesAPIResponse> {
    const result = await this.categoryService.findAll({
      ...query,
      companyId: user.companyId,
      includeMine: query.public ? query.includeMine : true,
    } as FindCategoryOptions & PaginationFilter);
    return CategoryMapper.toPaginationResDto(result);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MASTER_ADMIN)
  @ApiResponse({
    status: 201,
    description: 'Create category',
    type: CategoryResDto,
  })
  async create(
    @Body() body: CategoryReqDto,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<CategoryResDto> {
    const category = CategoryMapper.toEntity(body, user);
    category.createdBy = {
      userId: user.userId,
    } as UserEntity;
    category.companyId = [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(
      user.role,
    )
      ? null
      : user.companyId;
    category.isPublic = [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(
      user.role,
    );
    const result = await this.categoryService.create(category);
    return CategoryMapper.toResDto(result);
  }

  @Post('bulk')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MASTER_ADMIN)
  @ApiResponse({
    status: 201,
    description: 'Create categories',
    type: CategoryResDto,
  })
  async createBulk(
    @Body() body: CategoryReqDto[],
    @UserAuthData() user: AuthorizeResType,
  ): Promise<CategoryResDto[]> {
    console.log(JSON.stringify(user, null, 2));
    const categories = body
      .map((item) => CategoryMapper.toEntity(item, user))
      .map((item) => {
        item.createdBy = {
          userId: user.userId,
        } as UserEntity;
        item.isPublic = [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(
          user.role,
        );
        item.companyId = [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(
          user.role,
        )
          ? null
          : user.companyId;
        return item;
      });
    const result = await this.categoryService.createBulk(categories);
    return Promise.all(
      result.map(async (item) => CategoryMapper.toResDto(item)),
    );
  }

  @Get(':id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MASTER_ADMIN,
    UserRole.TECHNICIAN,
    UserRole.SERVICE_ADVISER,
  )
  @ApiResponse({
    status: 200,
    description: 'Return category by id',
    type: CategoryResDto,
  })
  async findOne(
    @Param('id') id: string,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<CategoryResDto> {
    const result = await this.categoryService.findOneByIdOrThrow(
      id,
      CustomException.create(ErrorCode.CATEGORY_NOT_FOUND),
    );
    if (
      !(
        result.isPublic ||
        result.companyId === user.companyId ||
        [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(user.role)
      )
    ) {
      throw CustomException.create(ErrorCode.CATEGORY_NOT_FOUND);
    }
    return CategoryMapper.toResDto(result);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MASTER_ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Update category by id',
    type: CategoryResDto,
  })
  async updateOne(
    @Param('id') id: string,
    @Body() body: CategoryReqDto,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<CategoryResDto> {
    const category = CategoryMapper.toEntity(body, user);
    category.id = id;
    category.isPublic = [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(
      user.role,
    );
    category.companyId = [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(
      user.role,
    )
      ? null
      : user.companyId;
    const result = await this.categoryService.updateOne(id, category, user);
    return CategoryMapper.toResDto(result);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MASTER_ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Delete category by id',
    type: null,
  })
  async deleteOne(
    @Param('id') id: string,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<void> {
    await this.categoryService.deleteOne(id, user);
  }
}
