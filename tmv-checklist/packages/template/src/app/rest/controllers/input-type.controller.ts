import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { InputTypeService } from 'src/app/template/services/inputType.service';
import { GetAllInputTypeAPIResponse, InputTypeResDto } from '../dtos/response';
import { InputTypeMapper } from '../mapper/input-type.mapper';
import { InputTypeReqDto } from '../dtos/request';
import { CustomException } from 'src/app/exceptions/custom-exception';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { Public } from 'src/app/auth/decorators';

@Controller('input-type')
@ApiTags('Input Type')
export class InputTypeController {
  constructor(private readonly inputTypeService: InputTypeService) {}

  @Get()
  @Public()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: GetAllInputTypeAPIResponse,
  })
  async findAll(): Promise<GetAllInputTypeAPIResponse> {
    const result = await this.inputTypeService.findAll();
    return InputTypeMapper.toPageResDto(result);
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: InputTypeResDto,
  })
  async findById(@Param('id') id: string): Promise<InputTypeResDto> {
    const result = await this.inputTypeService.findOneByIdOrThrow(
      id,
      CustomException.create(ErrorCode.INPUT_TYPE_NOT_FOUND),
    );
    return InputTypeMapper.toResDto(result);
  }

  @Post()
  @Public()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: InputTypeResDto,
  })
  async create(@Body() body: InputTypeReqDto): Promise<InputTypeResDto> {
    const inputType = InputTypeMapper.toEntity(body);
    const result = await this.inputTypeService.create(inputType);
    return InputTypeMapper.toResDto(result);
  }

  @Put(':id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: InputTypeResDto,
  })
  async update(
    @Param('id') id: string,
    @Body() body: InputTypeReqDto,
  ): Promise<InputTypeResDto> {
    const inputType = InputTypeMapper.toEntity(body);
    const result = await this.inputTypeService.update(id, inputType);
    return InputTypeMapper.toResDto(result);
  }

  @Delete(':id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
    type: null,
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.inputTypeService.delete(id);
  }
}
