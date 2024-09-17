import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsJSON,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

// template-task.dto.ts
export class TasksTemplateReqDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  inputTypeId: string;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  inputTypeOptions: string;

  @ApiProperty()
  @IsBoolean()
  enableCamera: boolean;

  @ApiProperty()
  @IsInt()
  order: number;

  @ApiProperty()
  @IsBoolean()
  enableComments: boolean;

  @ApiProperty()
  @IsBoolean()
  enableTrainingInfo: boolean;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  trainingInfoOptions: string;
}

// template-sub-category.dto.ts
export class SubCategoriesTemplateReqDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  refId?: string;

  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty({ type: [TasksTemplateReqDto] })
  @ValidateNested()
  tasks: TasksTemplateReqDto[];

  @ApiProperty()
  @IsInt()
  order: number;
}

// template-category.dto.ts
export class CategoriesTemplateReqDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  refId: string;

  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty({ type: [SubCategoriesTemplateReqDto] })
  @ValidateNested()
  subCategories: SubCategoriesTemplateReqDto[];

  @ApiProperty({ type: [TasksTemplateReqDto] })
  @ValidateNested()
  tasks: TasksTemplateReqDto[];

  @ApiProperty()
  @IsInt()
  order: number;
}

// template.dto.ts
export class TemplateReqDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsUUID()
  industryId: string;

  @ApiProperty({ type: [CategoriesTemplateReqDto] })
  @ValidateNested()
  categories: CategoriesTemplateReqDto[];
}
