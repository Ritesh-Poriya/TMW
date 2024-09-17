import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_REPOSITORY } from './constants';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Company, CompanyTenant } from './entities';
import { PageService, PaginationFilter } from '../common/pagination';
import { DATA_SOURCE } from '../db/constants';
import { FindCompanyOptions } from './@types';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';
import { ErrorCode } from '../exceptions/error-codes';
import { NATS_CLIENT } from '../nats/constants';
import { Stan } from 'node-nats-streaming';
import { CompanyCreatedEventPublisher } from './publishers/company-created-event.publisher';
import { objectLeftSubtractWithDifferentValue } from '../common/helpers/util';
import { CompanyDeletedEventPublisher } from './publishers/company-deleted-event.publisher';
import { CompanyUpdatedEventPublisher } from './publishers/company-updated-event.publisher';

@Injectable()
export class CompanyService extends PageService<Company> {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    readonly companyRepository: Repository<Company>,
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
    @Inject(NATS_CLIENT) private readonly natsClient: Stan,
  ) {
    super(companyRepository);
  }

  async create(company: Company): Promise<Company> {
    delete company.id;
    return this.save(company);
  }

  async findByTenantName(tenantName: string) {
    return this.companyRepository.findOne({
      where: {
        companyTenant: {
          tenantName,
        },
      },
      relations: {
        companyTenant: true,
        billingContact: true,
      },
    });
  }

  async findAll(filter: PaginationFilter & FindCompanyOptions) {
    const { ...params } = filter;
    return this.paginate(filter, this.createWhereQuery(params), {
      billingContact: true,
      companyTenant: true,
    });
  }

  private createWhereQuery(
    params: FindCompanyOptions,
  ): FindOptionsWhere<Company> | FindOptionsWhere<Company>[] {
    const query: FindOptionsWhere<Company>[] = [];
    if (params.search) {
      let where: FindOptionsWhere<Company> = {};
      where.name = ILike(`%${params.search}%`);
      query.push(where);
      where = {};
      where.companyTenant = {
        tenantMasterAdminEmail: ILike(`%${params.search}%`),
      };
      query.push(where);
      where = {};
      where.billingContact = {
        firstName: ILike(`%${params.search}%`),
      };
      query.push(where);
      where = {};
      where.billingContact = {
        lastName: ILike(`%${params.search}%`),
      };
      query.push(where);
      where = {};
      where.billingContact = {
        email: ILike(`%${params.search}%`),
      };
      query.push(where);
      where = {};
      where.billingContact = {
        phone: ILike(`%${params.search}%`),
      };
      query.push(where);
    }
    return query;
  }

  async update(company: Company, id: string): Promise<Company> {
    const foundCompany = await this.findById(id);
    if (!foundCompany) {
      throw CustomExceptionFactory.create(ErrorCode.COMPANY_NOT_FOUND);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      company.companyTenant.id = foundCompany.companyTenant.id;
      company.billingContact.id = foundCompany.billingContact.id;
      company.id = foundCompany.id;
      const tenantFieldsToUpdate = objectLeftSubtractWithDifferentValue(
        company.companyTenant,
        foundCompany.companyTenant,
      );
      if (Object.keys(tenantFieldsToUpdate).length > 0) {
        await queryRunner.manager.update(
          CompanyTenant,
          foundCompany.companyTenant.id,
          tenantFieldsToUpdate,
        );
      }
      await queryRunner.manager.save(company.billingContact);
      await queryRunner.manager.save(company);
      await queryRunner.commitTransaction();
      const updatedCompany = await this.findById(id);
      this.emitCompanyUpdatedEvent(
        updatedCompany,
        foundCompany.companyTenant.tenantMasterAdminEmail,
      );
      return updatedCompany;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async findById(id: string): Promise<Company> {
    return this.repository.findOne({
      where: {
        id,
      },
      relations: {
        companyTenant: true,
        billingContact: true,
      },
    });
  }

  public async delete(id: string) {
    const { affected } = await this.repository.delete({
      id,
    });
    this.emitCompanyDeletedEvent(id);
    if (affected < 1) {
      throw CustomExceptionFactory.create(ErrorCode.COMPANY_NOT_FOUND);
    }
  }

  private async save(company: Company): Promise<Company> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(company.companyTenant);
      await queryRunner.manager.save(company.billingContact);
      const result = await queryRunner.manager.save(company);
      this.emitCompanyCreatedEvent(result);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private emitCompanyCreatedEvent(company: Company) {
    new CompanyCreatedEventPublisher(this.natsClient).publish({
      companyId: company.id,
      firstName: company.billingContact.firstName,
      lastName: company.billingContact.lastName,
      userEmail: company.companyTenant.tenantMasterAdminEmail,
      maxUsers: company.companyTenant.maxUsers,
    });
  }

  private emitCompanyDeletedEvent(companyId: string) {
    new CompanyDeletedEventPublisher(this.natsClient).publish({
      companyId,
    });
  }

  private emitCompanyUpdatedEvent(company: Company, oldEmail: string) {
    new CompanyUpdatedEventPublisher(this.natsClient).publish({
      companyId: company.id,
      firstName: company.billingContact.firstName,
      lastName: company.billingContact.lastName,
      userEmail: company.companyTenant.tenantMasterAdminEmail,
      maxUsers: company.companyTenant.maxUsers,
      oldUserEmail: oldEmail,
    });
  }
}
