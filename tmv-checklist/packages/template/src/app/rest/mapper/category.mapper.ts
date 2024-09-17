import { Category, Industry } from 'src/app/template/entities';
import { CategoryResDto, GetAllCategoriesAPIResponse } from '../dtos/response';
import { PaginationResponse } from 'src/app/common/pagination';
import { CategoryReqDto } from '../dtos/request';
import { User } from 'src/app/users/entity/user.entity';
import { logAround } from 'src/app/logger/decorator/log-around';

export class CategoryMapper {
  @logAround()
  static toEntity(body: CategoryReqDto, user?: { userId: string }): Category {
    const category = new Category();
    category.name = body.name;
    category.description = body.description;
    category.updatedBy = {
      userId: user.userId,
    } as User;
    category.industry = {
      id: body.industryId,
    } as Industry;
    category.parent = body.parentId
      ? Promise.resolve({ id: body.parentId } as Category)
      : undefined;
    return category;
  }

  @logAround()
  static toResDto(category: Category): CategoryResDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      industryId: category.industry.id,
    };
  }

  @logAround()
  static toPaginationResDto(
    categories: PaginationResponse<Category>,
  ): GetAllCategoriesAPIResponse {
    return {
      items: categories.items.map((category) => this.toResDto(category)),
      meta: categories.meta,
    };
  }
}
