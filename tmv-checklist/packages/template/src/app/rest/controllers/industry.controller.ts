import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IndustryService } from 'src/app/template/services/industry.service';
import {
  GetAllIndustriesAPIResponse,
  IndustryAPIResponse,
} from '../dtos/response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndustryMapper } from '../mapper/industry.mapper';
import { IndustryRequestBody } from '../dtos/request';
import { FindIndustryDto } from '../dtos/request/industry-find.dto';
import { CustomValidationPipe } from 'src/app/common/CustomValidationPipe';
import { Public } from 'src/app/auth/decorators';

@Controller('industry')
@ApiTags('industry')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Get()
  @Public()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: GetAllIndustriesAPIResponse,
  })
  async findAll(
    @Query(CustomValidationPipe) query: FindIndustryDto,
  ): Promise<GetAllIndustriesAPIResponse> {
    const result = await this.industryService.findAll(query);
    return IndustryMapper.toPaginationResDTO(result);
  }

  @Post()
  @Public()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: IndustryAPIResponse,
  })
  async create(
    @Body() body: IndustryRequestBody,
  ): Promise<IndustryAPIResponse> {
    const industry = IndustryMapper.toIndustry(body);
    const result = await this.industryService.create(industry);
    return IndustryMapper.toResDTO(result);
  }

  @Get(':id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: IndustryAPIResponse,
  })
  public async getById(@Param('id') id: string): Promise<IndustryAPIResponse> {
    const result = await this.industryService.findOneById(id);
    return IndustryMapper.toResDTO(result);
  }

  @Put(':id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: IndustryAPIResponse,
  })
  public async updateById(
    @Param('id') id: string,
    @Body() body: IndustryRequestBody,
  ): Promise<IndustryAPIResponse> {
    const industry = IndustryMapper.toIndustry(body);
    industry.id = id;
    const result = await this.industryService.updateById(id, industry);
    return IndustryMapper.toResDTO(result);
  }

  @Delete(':id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
    type: null,
  })
  public async deleteById(@Param('id') id: string): Promise<void> {
    await this.industryService.deleteById(id);
  }
}
