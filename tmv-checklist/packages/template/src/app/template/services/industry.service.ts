import { Inject, Injectable } from '@nestjs/common';
import { INDUSTRY_REPOSITORY } from '../constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Industry } from '../entities';
import { FindIndustryOptions } from '../@types/find-industry';
import {
  PageService,
  PaginationFilter,
  PaginationResponse,
} from 'src/app/common/pagination';
import { CustomException } from 'src/app/exceptions/custom-exception';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { logAround } from 'src/app/logger/decorator/log-around';

@Injectable()
export class IndustryService extends PageService<Industry> {
  constructor(
    @Inject(INDUSTRY_REPOSITORY)
    industryRepository: Repository<Industry>,
  ) {
    super(industryRepository);
  }

  @logAround()
  async create(industry: Industry) {
    return this.repository.save(industry);
  }

  @logAround()
  async updateById(id: string, body: Industry) {
    const foundIndustry = await this.repository.findOneBy({ id });
    return this.repository.save({ ...foundIndustry, ...body });
  }
  async deleteById(id: string) {
    const { affected } = await this.repository.delete({
      id: id,
    });
    if (!affected) {
      throw CustomException.create(ErrorCode.INDUSTRY_NOT_FOUND);
    }
  }

  @logAround()
  async findOneById(id: string): Promise<Industry> {
    const industry = await this.repository.findOneBy({ id });
    if (!industry) {
      throw CustomException.create(ErrorCode.INDUSTRY_NOT_FOUND);
    }
    return industry;
  }

  @logAround()
  async findAll(
    filter: PaginationFilter & FindIndustryOptions,
  ): Promise<PaginationResponse<Industry>> {
    const { ...param } = filter;
    return this.paginate(filter, this.createWhereQuery(param));
  }

  @logAround()
  private createWhereQuery(
    params: FindIndustryOptions,
  ): FindOptionsWhere<Industry> {
    const where: FindOptionsWhere<Industry> = {};
    if (params.name) {
      where.name = params.name;
    }
    return where;
  }
}
