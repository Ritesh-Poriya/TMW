import { ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';

export class CategoryResDto {
  @ApiResponseProperty({ example: '' })
  id: string;

  @ApiResponseProperty({
    example: 'Bathroom',
  })
  name: string;

  @ApiResponseProperty({
    example: 'Parent category for all bathroom related categories',
  })
  description: string;

  @ApiPropertyOptional({
    example: '0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a',
  })
  parentId?: string;

  @ApiPropertyOptional({
    example: '0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a',
  })
  industryId: string;

  @ApiPropertyOptional({
    type: [CategoryResDto],
  })
  subCategories?: CategoryResDto[];
}
