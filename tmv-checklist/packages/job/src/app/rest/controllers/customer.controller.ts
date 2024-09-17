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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindCustomerDto } from '../dtos/requests';
import { GetAllCustomerAPIResponse } from '../dtos/responses/get-all-customer.dto';
import { CustomValidationPipe } from 'src/app/common/CustomValidationPipe';
import { CustomerReqDto } from '../dtos/requests/job.dto';
import { CustomerResDto } from '../dtos/responses/job.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return all customers',
    type: GetAllCustomerAPIResponse,
  })
  async findAll(
    @Query(CustomValidationPipe)
    query: FindCustomerDto,
  ): Promise<GetAllCustomerAPIResponse> {
    console.log('🚀 ~ CustomerController ~ query:', query);
    return {
      items: [],
      meta: {
        totalItems: 598,
        currentPage: 4,
        itemCount: 5,
        itemsPerPage: 5,
        totalPages: 4,
      },
    };
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create customer',
    type: CustomerResDto,
  })
  async create(@Body() body: CustomerReqDto): Promise<CustomerResDto> {
    return {
      id: '123456',
      firstName: body.firstName,
      lastName: body.lastName,
      serviceAddress: body.serviceAddress,
      billingAddress: body.billingAddress,
      phoneNumber: body.phoneNumber,
    };
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return customer by id',
    type: CustomerResDto,
  })
  async findOne(@Param('id') id: string): Promise<CustomerResDto> {
    return {
      id: id,
      firstName: 'john',
      lastName: 'doe',
      serviceAddress: 'surat',
      billingAddress: 'goa',
      phoneNumber: '9856325698',
    };
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Update customer by id',
    type: CustomerResDto,
  })
  async updateOne(
    @Param('id') id: string,
    @Body() body: CustomerReqDto,
  ): Promise<CustomerResDto> {
    return {
      id: id,
      firstName: body.firstName,
      lastName: body.lastName,
      serviceAddress: body.serviceAddress,
      billingAddress: body.billingAddress,
      phoneNumber: body.phoneNumber,
    };
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete category by id',
    type: null,
  })
  async deleteOne(@Param('id') id: string): Promise<string> {
    return `customer deleted ${id}`;
  }
}
