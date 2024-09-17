import { Inject, Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { TEMPLATE_REPOSITORY } from '../constants';
import { Template } from '../entities';
import { DATA_SOURCE } from 'src/app/db/constants';
import { CustomException } from 'src/app/exceptions/custom-exception';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { PageService, PaginationFilter } from 'src/app/common/pagination';
import { FindTemplateOptions } from '../@types';
import { UserRole } from 'src/app/users/@types';
import { logAround } from 'src/app/logger/decorator/log-around';

@Injectable()
export class TemplateService extends PageService<Template> {
  constructor(
    @Inject(DATA_SOURCE) private dataSource: DataSource,
    @Inject(TEMPLATE_REPOSITORY)
    readonly templateRepository: Repository<Template>,
  ) {
    super(templateRepository);
  }

  @logAround()
  async create(
    template: Template,
    user: { userId: string; role: UserRole; companyId: string },
  ) {
    if (template.id) {
      const foundTemplate = await this.templateRepository.findOne({
        where: { id: template.id },
        relations: { createdBy: true },
      });
      if (
        !foundTemplate ||
        (foundTemplate.isPublic === false &&
          foundTemplate.companyId !== user.companyId) ||
        (foundTemplate.isPublic === true &&
          ![UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(user.role))
      ) {
        throw CustomException.create(ErrorCode.TEMPLATE_NOT_FOUND);
      }
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let savedTemplate: Template = null;
    try {
      for (const linkedCategory of template.linkedCategories) {
        for (const linkedSubCategory of linkedCategory.linkedSubCategories) {
          await queryRunner.manager.save(linkedSubCategory.tasks);
          await queryRunner.manager.save(linkedSubCategory);
        }
        await queryRunner.manager.save(linkedCategory.tasks);
        await queryRunner.manager.save(linkedCategory);
      }
      await queryRunner.manager.save(template);
      await queryRunner.commitTransaction();
      savedTemplate = await this.templateRepository.findOne({
        where: { id: template.id },
        relations: {
          linkedCategories: {
            tasks: {
              inputType: true,
            },
            linkedSubCategories: {
              tasks: {
                inputType: true,
              },
            },
          },
          industry: true,
        },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return savedTemplate;
  }

  @logAround()
  async findAll(filter: PaginationFilter & FindTemplateOptions) {
    const { ...param } = filter;
    return this.paginate(filter, this.createWhereQuery(param), {
      industry: true,
    });
  }

  @logAround()
  async findOneByIdOrThrow(id: string, throwable?: Error) {
    const result = await this.templateRepository.findOne({
      where: { id },
      relations: {
        linkedCategories: {
          linkedSubCategories: {
            tasks: {
              inputType: true,
            },
          },
          tasks: {
            inputType: true,
          },
        },
        industry: true,
        createdBy: true,
      },
    });
    if (!result && throwable) {
      throw throwable;
    }
    return result || null;
  }

  @logAround()
  async delete(
    id: string,
    user: { userId: string; role: UserRole; companyId: string },
  ) {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: { createdBy: true },
    });
    if (
      !template ||
      (template.isPublic === false && template.companyId !== user.companyId) ||
      (template.isPublic === true &&
        ![UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(user.role))
    ) {
      throw CustomException.create(ErrorCode.TEMPLATE_NOT_FOUND);
    }
    await this.templateRepository.update(
      {
        id,
      },
      {
        updatedBy: {
          userId: user.userId,
        },
        deletedBy: {
          userId: user.userId,
        },
      },
    );
    const { affected } = await this.templateRepository.delete({
      id,
    });
    if (affected === 0) {
      throw CustomException.create(ErrorCode.TEMPLATE_NOT_FOUND);
    }
  }

  @logAround()
  private createWhereQuery(
    param: FindTemplateOptions,
  ): FindOptionsWhere<Template> | FindOptionsWhere<Template>[] {
    const where: FindOptionsWhere<Template> = {};
    if (param.name) {
      where.name = ILike(`%${param.name}%`);
    }
    if (param.industryId) {
      where.industry = { id: param.industryId };
    }
    if (param.public) {
      where.isPublic = param.public;
    }
    if (param.companyId) {
      where.companyId = param.companyId;
    }
    return where;
  }

  @logAround()
  public async deleteByCompanyId(companyId: string) {
    await this.templateRepository.delete({
      companyId,
    });
  }
}
