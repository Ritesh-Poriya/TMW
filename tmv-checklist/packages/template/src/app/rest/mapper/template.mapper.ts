import { Template, Industry } from 'src/app/template/entities';
import { TemplateReqDto } from '../dtos/request';
import {
  GetAllTemplateResDto,
  GetTemplateEntityResDto,
  TemplateResDto,
} from '../dtos/response/template.dto';
import { PaginationResponse } from 'src/app/common/pagination';
import { User } from 'src/app/users/entity/user.entity';
import { logAround } from 'src/app/logger/decorator/log-around';
import { LinkedCategoryMapper } from './linked-category.mapper';
import { LinkedCategory } from 'src/app/template/entities/linkedCategory.entity';

export class TemplateMapper {
  @logAround()
  static toEntity(dto: TemplateReqDto, user: { userId: string }): Template {
    const template = new Template();
    template.id = dto.id || undefined;
    template.name = dto.name;
    template.description = dto.description;
    if (!dto.id) {
      template.createdBy = {
        userId: user.userId,
      } as User;
    }
    template.updatedBy = {
      userId: user.userId,
    } as User;
    template.industry = { id: dto.industryId } as Industry;
    template.linkedCategories = LinkedCategoryMapper.toEntities(
      dto.categories,
      !!template.id,
    );
    return template;
  }

  @logAround()
  static async toResDto(result: Template): Promise<TemplateResDto> {
    return {
      id: result.id,
      name: result.name,
      description: result.description,
      industryId: result.industry.id,
      categories: result.linkedCategories.map(
        (linkedCategory: LinkedCategory) => {
          return LinkedCategoryMapper.toResDto(linkedCategory);
        },
      ),
    };
  }

  @logAround()
  static toGetAllResDto(
    result: PaginationResponse<Template>,
  ): GetAllTemplateResDto {
    return {
      items: result.items.map((item) => TemplateMapper.toGetResDto(item)),
      meta: result.meta,
    };
  }

  static toGetResDto(template: Template): GetTemplateEntityResDto {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      industryId: template.industry.id,
      industryName: template.industry?.name,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}
