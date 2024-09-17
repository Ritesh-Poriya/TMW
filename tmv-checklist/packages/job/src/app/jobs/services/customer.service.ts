import { Inject, Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { logAround } from 'src/app/logger/decorator/log-around';
import { Model } from 'mongoose';
import { CUSTOMER_MODEL } from 'src/app/tenant/constants';

@Injectable()
export class CustomerService {
  constructor(@Inject(CUSTOMER_MODEL) private customerModel: Model<Customer>) {}

  @logAround()
  async create(body: Customer): Promise<Customer> {
    return await this.customerModel.create(body);
  }

  @logAround()
  async update(body: Customer, id: string): Promise<Customer> {
    return await this.customerModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
}
