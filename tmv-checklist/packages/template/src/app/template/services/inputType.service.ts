import { Inject, Injectable } from '@nestjs/common';
import { INPUT_TYPE_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { InputType } from '../entities';
import { CustomException } from 'src/app/exceptions/custom-exception';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { logAround } from 'src/app/logger/decorator/log-around';

@Injectable()
export class InputTypeService {
  constructor(
    @Inject(INPUT_TYPE_REPOSITORY)
    private readonly inputTypeRepository: Repository<InputType>,
  ) {}

  @logAround()
  async findAll() {
    return this.inputTypeRepository.find();
  }

  @logAround()
  async findOneByIdOrThrow(id: string, throwable?: Error) {
    const result = await this.inputTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!result && throwable) {
      throw throwable;
    }
    return result;
  }

  @logAround()
  async create(inputType: InputType) {
    return this.inputTypeRepository.save(inputType);
  }

  @logAround()
  async update(id: string, inputType: InputType) {
    const inputTypeToUpdate = await this.findOneByIdOrThrow(
      id,
      CustomException.create(ErrorCode.INPUT_TYPE_NOT_FOUND),
    );
    return this.inputTypeRepository.save({
      ...inputTypeToUpdate,
      ...inputType,
    });
  }

  @logAround()
  async delete(id: string) {
    const { affected } = await this.inputTypeRepository.delete(id);
    if (!affected) {
      throw CustomException.create(ErrorCode.INPUT_TYPE_NOT_FOUND);
    }
  }
}
