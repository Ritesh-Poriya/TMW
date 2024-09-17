import { logAround } from 'src/app/logger/decorator/log-around';
import { Customer } from 'src/app/jobs/entities/customer.entity';
import { CustomerReqDto } from '../dtos/requests/job.dto';
import { CustomerResDto } from '../dtos/responses/job.dto';

export class CustomerMapper {
  @logAround()
  static toEntity(dto: CustomerReqDto): Customer {
    const customer = new Customer();

    customer.firstName = dto.firstName;
    customer.lastName = dto.lastName;
    customer.serviceAddress = dto.serviceAddress;
    customer.phoneNumber = dto.phoneNumber;
    customer.billingAddress = dto.billingAddress;

    return customer;
  }

  @logAround()
  static toResDto(result: Customer): CustomerResDto {
    return {
      id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      phoneNumber: result.phoneNumber,
      serviceAddress: result.serviceAddress,
      billingAddress: result.billingAddress,
    };
  }
}
