import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { logAround } from '../../logger/decorator/log-around';
import { FindJobDto } from '../../rest/dtos/requests';
import { Customer } from '../entities/customer.entity';
import { CustomExceptionFactory } from 'src/app/exceptions/custom-exception.factory';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { JobStatus } from '../@types';
import { FinishChecklistReqDto } from 'src/app/rest/dtos/requests/finish-checklist.dto';
import { ApprovedJobReqDto } from 'src/app/rest/dtos/requests/approved-job.dto';
import { CompleteJobReqDto } from 'src/app/rest/dtos/requests/complete-job.dto';
import { CUSTOMER_MODEL, JOB_MODEL } from 'src/app/tenant/constants';
import { Job } from '../entities/job.entity';
import { AuthorizeResType } from 'src/app/auth/@types';
import { SortOrder } from 'src/app/common/@types';

@Injectable()
export class JobService {
  constructor(
    @Inject(JOB_MODEL) private jobModel: Model<Job>,
    @Inject(CUSTOMER_MODEL) private customerModel: Model<Customer>,
  ) {}

  @logAround()
  async create(body: Job): Promise<Job> {
    body.customerId = await this.customerModel.create(body.customerId);

    return await this.jobModel.create(body);
  }

  @logAround()
  async findAll(query: FindJobDto): Promise<Job[]> {
    const aggregationPipeline = [];

    aggregationPipeline.push(
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerId',
        },
      },
      {
        $unwind: {
          path: '$customerId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $skip: (query.page - 1) * query.pageSize,
      },
      {
        $limit: query.pageSize,
      },
      {
        $sort: {
          [query['orderBy']]: query['sortOrder'] === SortOrder.ASC ? 1 : -1,
        },
      },
    );

    if (query.fromDate && query.toDate) {
      aggregationPipeline.push({
        $match: {
          date: {
            $gte: new Date(query.fromDate),
            $lte: new Date(query.toDate),
          },
        },
      });
    }

    if (query.status) {
      aggregationPipeline.push({
        $match: {
          status: { $in: query.status },
        },
      });
    }

    aggregationPipeline.push({
      $addFields: {
        technicianName: {
          $concat: ['$jobTechnician.firstName', ' ', '$jobTechnician.lastName'],
        },
        customerName: {
          $concat: ['$customerId.firstName', ' ', '$customerId.lastName'],
        },
        stringifyJobNumber: { $convert: { input: '$jobNumber', to: 'string' } },
      },
    });

    if (query.search) {
      const search = { $regex: `/*${query.search}/*`, $options: 'i' };
      aggregationPipeline.push({
        $match: {
          $or: [
            { stringifyJobNumber: search },
            { technicianName: search },
            { customerName: search },
            { 'customerId.serviceAddress': search },
          ],
        },
      });
    }

    return await this.jobModel.aggregate(aggregationPipeline).exec();
  }

  @logAround()
  async findMy(query: FindJobDto, user: AuthorizeResType): Promise<Job[]> {
    const aggregationPipeline = [];

    aggregationPipeline.push(
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerId',
        },
      },
      {
        $unwind: {
          path: '$customerId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'jobTechnician.id': user.userId,
        },
      },
      {
        $skip: (query.page - 1) * query.pageSize,
      },
      {
        $limit: query.pageSize,
      },
      {
        $sort: {
          [query['orderBy']]: query['sortOrder'] === SortOrder.ASC ? 1 : -1,
        },
      },
    );

    if (query.fromDate && query.toDate) {
      aggregationPipeline.push({
        $match: {
          date: {
            $gte: new Date(query.fromDate),
            $lte: new Date(query.toDate),
          },
        },
      });
    }

    if (query.status) {
      aggregationPipeline.push({
        $match: {
          status: { $in: query.status },
        },
      });
    }

    aggregationPipeline.push({
      $addFields: {
        technicianName: {
          $concat: ['$jobTechnician.firstName', ' ', '$jobTechnician.lastName'],
        },
        customerName: {
          $concat: ['$customerId.firstName', ' ', '$customerId.lastName'],
        },
        stringifyJobNumber: { $convert: { input: '$jobNumber', to: 'string' } },
      },
    });

    if (query.search) {
      const search = { $regex: `/*${query.search}/*`, $options: 'i' };
      aggregationPipeline.push({
        $match: {
          $or: [
            { stringifyJobNumber: search },
            { technicianName: search },
            { customerName: search },
            { 'customerId.serviceAddress': search },
          ],
        },
      });
    }

    return await this.jobModel.aggregate(aggregationPipeline).exec();
  }

  @logAround()
  async findById(id: string): Promise<Job> {
    const job = await this.jobModel.findById(id).populate('customerId');
    if (!job) {
      throw CustomExceptionFactory.create(ErrorCode.JOB_NOT_FOUND);
    }
    return job;
  }

  @logAround()
  async update(body: Job, id: string): Promise<Job> {
    const foundJob = await this.findById(id);
    if (!foundJob) {
      throw CustomExceptionFactory.create(ErrorCode.JOB_NOT_FOUND);
    }

    if (foundJob.status !== JobStatus.INCOMPLETE) {
      throw CustomExceptionFactory.create(
        ErrorCode.JOB_UPDATE_STATUS_VALIDATION_ERROR,
      );
    }

    body._id = id;
    body.customerId._id = foundJob.customerId._id;

    await this.customerModel.updateOne(
      { _id: new Types.ObjectId(String(body.customerId._id)) },
      { $set: body.customerId },
    );

    delete body.customerId;

    return this.jobModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(String(id)) },
        { $set: body },
        { new: true },
      )
      .populate('customerId');
  }

  @logAround()
  async updateFinishChecklist(
    body: FinishChecklistReqDto,
    id: string,
  ): Promise<Job> {
    const foundJob = await this.findById(id);
    if (!foundJob) {
      throw CustomExceptionFactory.create(ErrorCode.JOB_NOT_FOUND);
    }

    if (foundJob.status !== JobStatus.INCOMPLETE) {
      throw CustomExceptionFactory.create(
        ErrorCode.JOB_UPDATE_STATUS_VALIDATION_ERROR,
      );
    }

    return await this.jobModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(String(id)) },
        { $set: { ...body, status: JobStatus.REQUESTED_FOR_APPROVAL } },
        { new: true },
      )
      .populate('customerId');
  }

  @logAround()
  async updateApprovedJob(body: ApprovedJobReqDto, id: string): Promise<void> {
    const foundJob = await this.findById(id);
    if (!foundJob) {
      throw CustomExceptionFactory.create(ErrorCode.JOB_NOT_FOUND);
    }

    if (foundJob.status !== JobStatus.REQUESTED_FOR_APPROVAL) {
      throw CustomExceptionFactory.create(
        ErrorCode.JOB_UPDATE_STATUS_VALIDATION_ERROR,
      );
    }

    await this.jobModel.updateOne(
      { _id: new Types.ObjectId(String(id)) },
      { $set: { ...body, status: JobStatus.APPROVED } },
    );
  }

  @logAround()
  async updateCompleteJob(body: CompleteJobReqDto, id: string): Promise<void> {
    const foundJob = await this.findById(id);
    if (!foundJob) {
      throw CustomExceptionFactory.create(ErrorCode.JOB_NOT_FOUND);
    }

    if (
      body.isSelfAgreed === true &&
      foundJob.status !== JobStatus.REQUESTED_FOR_APPROVAL
    ) {
      throw CustomExceptionFactory.create(
        ErrorCode.JOB_UPDATE_STATUS_VALIDATION_ERROR,
      );
    }

    if (body.isSelfAgreed === false && foundJob.status !== JobStatus.APPROVED) {
      throw CustomExceptionFactory.create(
        ErrorCode.JOB_UPDATE_STATUS_VALIDATION_ERROR,
      );
    }

    await this.jobModel.updateOne(
      { _id: new Types.ObjectId(String(id)) },
      { $set: { ...body, status: JobStatus.COMPLETED } },
    );
  }

  @logAround()
  async delete(id: string): Promise<any> {
    const job = await this.jobModel.findById(id);

    if (!job) {
      throw CustomExceptionFactory.create(ErrorCode.JOB_NOT_FOUND);
    }

    await this.customerModel.deleteOne({
      _id: new Types.ObjectId(job.customerId._id),
    });

    return await this.jobModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
  }
}
