import { logAround } from 'src/app/logger/decorator/log-around';
import { JobReqDto } from '../dtos/requests';
import { Job } from 'src/app/jobs/entities/job.entity';
import { JobStatus } from 'src/app/jobs/@types';
import { JobResDto } from '../dtos/responses';
import { CustomerMapper } from './customer.mapper';
import { AuthorizeResType } from 'src/app/auth/@types';

export class JobMapper {
  @logAround()
  static toEntity(dto: JobReqDto, user: AuthorizeResType): Job {
    const job = new Job();
    job.templateId = dto.templateId;
    job.templateName = dto.templateName;
    job.date = dto.date;
    job.status = JobStatus.INCOMPLETE;
    job.jobNumber = dto.jobNumber;
    job.checklistSchema = dto.checklistSchema;
    job.customerId = CustomerMapper.toEntity(dto.jobCustomer);
    job.jobTechnician = {
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.userId,
    };

    return job;
  }

  @logAround()
  static toResDto(result: Job): JobResDto {
    return {
      id: result._id,
      templateId: result.templateId,
      templateName: result.templateName,
      date: result.date,
      jobNumber: result.jobNumber,
      status: result.status,
      techSummery: result.techSummery,
      technicianSinature: result.technicianSinature,
      customerSignature: result.customerSignature,
      agreedUponNextStep: result.agreedUponNextStep,
      jobCustomer: CustomerMapper.toResDto(result.customerId),
      jobTechnician: result.jobTechnician,
      checklistSchema: result.checklistSchema,
      checklistResponse: result.checklistResponse,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
