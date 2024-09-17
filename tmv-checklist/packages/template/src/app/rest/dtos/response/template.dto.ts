import { ApiResponseProperty } from '@nestjs/swagger';
import { InputTypeResDto } from './input-type.dto';
import { PaginationMetaDto } from 'src/app/common/pagination';

export class TaskTemplateResDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty({ type: InputTypeResDto })
  inputType: InputTypeResDto;

  @ApiResponseProperty()
  inputTypeOptions: string;

  @ApiResponseProperty()
  order: number;

  @ApiResponseProperty()
  enableCamera: boolean;

  @ApiResponseProperty()
  enableComments: boolean;

  @ApiResponseProperty()
  enableTrainingInfo: boolean;

  @ApiResponseProperty()
  trainingInfoOptions: string;
}

export class SubCategoriesTemplateResDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  refId: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  order: number;

  @ApiResponseProperty({ type: [TaskTemplateResDto] })
  tasks: TaskTemplateResDto[];
}
export class CategoriesTemplateResDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  refId: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  order: number;

  @ApiResponseProperty({ type: [SubCategoriesTemplateResDto] })
  subCategories: SubCategoriesTemplateResDto[];

  @ApiResponseProperty({ type: [TaskTemplateResDto] })
  tasks: TaskTemplateResDto[];
}

export class TemplateResDto {
  @ApiResponseProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiResponseProperty({
    example: 'template name',
  })
  name: string;

  @ApiResponseProperty({
    example: 'Sample description',
  })
  description: string;

  @ApiResponseProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  industryId: string;

  @ApiResponseProperty({ type: [CategoriesTemplateResDto] })
  categories: CategoriesTemplateResDto[];
}

export class GetTemplateEntityResDto {
  @ApiResponseProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiResponseProperty({
    example: 'template name',
  })
  name: string;

  @ApiResponseProperty({
    example: 'Sample description',
  })
  description: string;

  @ApiResponseProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  industryId: string;

  @ApiResponseProperty({
    example: 'HVAC',
  })
  industryName: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}

export class GetAllTemplateResDto {
  @ApiResponseProperty({ type: [GetTemplateEntityResDto] })
  items: GetTemplateEntityResDto[];

  @ApiResponseProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
