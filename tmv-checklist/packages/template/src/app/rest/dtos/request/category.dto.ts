import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CategoryReqDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the category',
    example: 'Bathroom',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The description of the category',
    example: 'Parent category for all bathroom related categories',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'UUID of the parent category of the category',
    example: '0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a',
  })
  parentId?: string;

  @IsString()
  @ApiProperty({
    description: 'UUID of the parent category of the category',
    example: '0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a',
  })
  industryId: string;
}
