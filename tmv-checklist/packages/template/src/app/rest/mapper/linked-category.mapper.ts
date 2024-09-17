import { logAround } from 'src/app/logger/decorator/log-around';
import { CategoriesTemplateReqDto } from '../dtos/request';
import { LinkedSubCategoryMapper } from './linked-sub-category.mapper';
import { TaskMapper } from './task.mapper';
import { LinkedCategory } from 'src/app/template/entities/linkedCategory.entity';
import { CategoriesTemplateResDto } from '../dtos/response/template.dto';

export class LinkedCategoryMapper {
  @logAround()
  static toEntities(
    dtos: CategoriesTemplateReqDto[],
    toUpdateTemplate: boolean,
  ): LinkedCategory[] {
    return dtos.map((categoryDto: CategoriesTemplateReqDto) => {
      return LinkedCategoryMapper.toEntity(categoryDto, toUpdateTemplate);
    });
  }

  @logAround()
  static toEntity(
    categoryDto: CategoriesTemplateReqDto,
    toUpdateTemplate: boolean,
  ): LinkedCategory {
    const linkedCategory = new LinkedCategory();
    linkedCategory.id = toUpdateTemplate ? categoryDto.id : undefined;
    linkedCategory.refId = categoryDto.refId;
    linkedCategory.order = categoryDto.order;
    linkedCategory.name = categoryDto.name;
    linkedCategory.linkedSubCategories = LinkedSubCategoryMapper.toEntities(
      categoryDto.subCategories,
      !!linkedCategory.id,
    );
    linkedCategory.tasks = TaskMapper.toEntities(
      categoryDto.tasks,
      !!linkedCategory.id,
    );
    return linkedCategory;
  }

  @logAround()
  static toResDto(linkedCategory: LinkedCategory): CategoriesTemplateResDto {
    return {
      id: linkedCategory.id,
      refId: linkedCategory.refId,
      name: linkedCategory.name,
      order: linkedCategory.order,
      tasks: linkedCategory.tasks.map((task) => {
        return TaskMapper.toResDto(task);
      }),
      subCategories: linkedCategory.linkedSubCategories.map(
        (linkedSubCategory) => {
          return LinkedSubCategoryMapper.toResDto(linkedSubCategory);
        },
      ),
    };
  }
}
