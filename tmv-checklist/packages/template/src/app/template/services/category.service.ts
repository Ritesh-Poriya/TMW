import { Inject, Injectable } from '@nestjs/common';
import { PageService, PaginationFilter } from 'src/app/common/pagination';
import { Category } from '../entities';
import { CATEGORY_REPOSITORY } from '../constants';
import { DeepPartial, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { FindCategoryOptions } from '../@types/find-category';
import { CustomException } from 'src/app/exceptions/custom-exception';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { UserRole } from 'src/app/users/@types';
import { logAround } from 'src/app/logger/decorator/log-around';

@Injectable()
export class CategoryService extends PageService<Category> {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  @logAround()
  async create(body: Category): Promise<Category> {
    return this.categoryRepository.save(body);
  }

  @logAround()
  async createBulk(categories: Category[]): Promise<Category[]> {
    return this.categoryRepository.save(categories);
  }

  @logAround()
  async findOneByIdOrThrow(id: string, throwable: Error) {
    const result = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!result) {
      throw throwable;
    }
    return result;
  }

  @logAround()
  async updateOne(
    id: string,
    category: Category,
    user: { userId: string; role: UserRole },
  ) {
    const foundCategory = await this.findOneByIdOrThrow(
      id,
      CustomException.create(ErrorCode.CATEGORY_NOT_FOUND),
    );
    if (
      !foundCategory ||
      (foundCategory.isPublic === false &&
        foundCategory.createdBy.userId !== user.userId) ||
      (foundCategory.isPublic === true &&
        ![UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(user.role))
    ) {
      throw CustomException.create(ErrorCode.CATEGORY_NOT_FOUND);
    }
    return this.categoryRepository.save({
      ...foundCategory,
      ...category,
    });
  }

  @logAround()
  findAll(filter: PaginationFilter & FindCategoryOptions) {
    const { ...param } = filter;
    return this.paginate(filter, this.createWhereQuery(param), {
      industry: true,
    });
  }

  @logAround()
  async deleteOne(
    id: string,
    user: { userId: string; role: UserRole; companyId: string },
  ) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { createdBy: true },
    });
    if (
      !category ||
      (category.isPublic === false && category.companyId !== user.companyId) ||
      (category.isPublic === true &&
        ![UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(user.role))
    ) {
      throw CustomException.create(ErrorCode.CATEGORY_NOT_FOUND);
    }
    await this.categoryRepository.update(
      { id },
      {
        updatedBy: {
          userId: user.userId,
        },
        deletedBy: {
          userId: user.userId,
        },
      },
    );
    const { affected } = await this.categoryRepository.softDelete({
      id,
    });
    if (!affected) {
      throw CustomException.create(ErrorCode.CATEGORY_NOT_FOUND);
    }
  }

  @logAround()
  private createWhereQuery(
    param: DeepPartial<FindCategoryOptions>,
  ): FindOptionsWhere<Category> | FindOptionsWhere<Category>[] {
    const where: FindOptionsWhere<Category>[] = [];
    const andConditions: FindOptionsWhere<Category> = {};
    if (param.name) {
      andConditions.name = param.name;
    }
    if (param.parentCategoryId) {
      andConditions.parent = {
        id: param.parentCategoryId,
      };
    } else {
      andConditions.parent = {
        id: IsNull(),
      };
    }
    if (param.industryId) {
      andConditions.industry = {
        id: param.industryId,
      };
    }
    const includeMineConditions: FindOptionsWhere<Category> = {
      ...andConditions,
      companyId: param.companyId,
    };
    const isPublicCondition: FindOptionsWhere<Category> = {
      ...andConditions,
      isPublic: true,
    };

    if (param.includeMine) {
      where.push(includeMineConditions);
    }

    if (param.public) {
      where.push(isPublicCondition);
    }

    return where;
  }

  @logAround()
  public async deleteByCompanyId(companyId: string) {
    await this.categoryRepository.delete({
      companyId,
    });
  }
}
