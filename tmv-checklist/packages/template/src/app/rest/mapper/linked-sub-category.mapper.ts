import { logAround } from 'src/app/logger/decorator/log-around';
import { SubCategoriesTemplateReqDto } from '../dtos/request/template.dto';
import { TaskMapper } from './task.mapper';
import { LinkedSubCategory } from 'src/app/template/entities/linkedSubCategory.entity';
import { SubCategoriesTemplateResDto } from '../dtos/response/template.dto';

export class LinkedSubCategoryMapper {
  @logAround()
  static toEntities(
    dtos: SubCategoriesTemplateReqDto[],
    toUpdateParentCategory: boolean,
  ): LinkedSubCategory[] {
    return dtos.map((subCategoryDto: SubCategoriesTemplateReqDto) => {
      return this.toEntity(subCategoryDto, toUpdateParentCategory);
    });
  }
  static toEntity(
    subCategoryDto: SubCategoriesTemplateReqDto,
    toUpdateParentCategory: boolean,
  ): LinkedSubCategory {
    const linkedSubCategory: LinkedSubCategory = new LinkedSubCategory();
    linkedSubCategory.id = toUpdateParentCategory
      ? subCategoryDto.id
      : undefined;
    linkedSubCategory.refId = subCategoryDto.refId;
    linkedSubCategory.name = subCategoryDto.name;
    linkedSubCategory.order = subCategoryDto.order;
    linkedSubCategory.tasks = TaskMapper.toEntities(
      subCategoryDto.tasks,
      !!linkedSubCategory.id,
    );

    return linkedSubCategory;
  }

  static toResDto(
    linkedSubCategory: LinkedSubCategory,
  ): SubCategoriesTemplateResDto {
    return {
      id: linkedSubCategory.id,
      name: linkedSubCategory.name,
      order: linkedSubCategory.order,
      refId: linkedSubCategory.refId,
      tasks: linkedSubCategory.tasks.map((task) => {
        return TaskMapper.toResDto(task);
      }),
    };
  }
}
