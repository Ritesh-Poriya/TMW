import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Sse,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobResDto } from '../dtos/responses';
import { FindJobDto, JobReqDto } from '../dtos/requests';
import { CustomValidationPipe } from '../../common/CustomValidationPipe';
import { JobMapper } from '../mapper';
import { JobService } from '../../jobs/services/job.service';
import { AuthorizeResType, UserRole } from '../../auth/@types';
import { UserAuthData } from '../../auth/decorators';
import { GetAllJobAPIResponse } from '../dtos/responses/job.dto';
import { Roles } from 'src/app/auth/decorators/roles.decorator';
import { FinishChecklistReqDto } from '../dtos/requests/finish-checklist.dto';
import { ApprovedJobReqDto } from '../dtos/requests/approved-job.dto';
import { CompleteJobReqDto } from '../dtos/requests/complete-job.dto';
import {
  Observable,
  Subject,
  from,
  interval,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { JobStatus } from 'src/app/jobs/@types';
import { Job } from 'src/app/jobs/entities/job.entity';
@ApiTags('Job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return all jobs',
    type: GetAllJobAPIResponse,
  })
  @Roles(UserRole.SERVICE_ADVISER)
  async findAll(
    @Query(CustomValidationPipe)
    query: FindJobDto,
  ): Promise<GetAllJobAPIResponse> {
    const jobs = await this.jobService.findAll(query);
    const total = jobs.length;
    return {
      items: jobs.map((job) => {
        return JobMapper.toResDto(job);
      }),
      meta: {
        currentPage: query.page,
        itemsPerPage: query.pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / query.pageSize),
        itemCount: total,
      },
    };
  }

  @Get('/my')
  @ApiResponse({
    status: 200,
    description: 'Return all jobs by specific technician',
    type: GetAllJobAPIResponse,
  })
  @Roles(UserRole.TECHNICIAN)
  async findMy(
    @Query(CustomValidationPipe)
    query: FindJobDto,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<GetAllJobAPIResponse> {
    const jobs = await this.jobService.findMy(query, user);
    const total = jobs.length;
    return {
      items: jobs.map((job) => {
        return JobMapper.toResDto(job);
      }),
      meta: {
        currentPage: query.page,
        itemsPerPage: query.pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / query.pageSize),
        itemCount: total,
      },
    };
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create job',
    type: JobResDto,
  })
  @Roles(UserRole.TECHNICIAN)
  async create(
    @Body() body: JobReqDto,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<JobResDto> {
    const job = JobMapper.toEntity(body, user);
    const result = await this.jobService.create(job);

    return JobMapper.toResDto(result);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return job by id',
    type: JobResDto,
  })
  @Roles(UserRole.TECHNICIAN, UserRole.SERVICE_ADVISER)
  async findOne(@Param('id') id: string): Promise<JobResDto> {
    const job = await this.jobService.findById(id);
    return JobMapper.toResDto(job);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Update job by id',
    type: JobResDto,
  })
  @Roles(UserRole.TECHNICIAN, UserRole.SERVICE_ADVISER)
  async update(
    @Param('id') id: string,
    @Body() body: JobReqDto,
    @UserAuthData() user: AuthorizeResType,
  ): Promise<JobResDto> {
    const job = JobMapper.toEntity(body, user);

    const updatedJob = await this.jobService.update(job, id);

    return JobMapper.toResDto(updatedJob);
  }

  @Patch('/finishChecklist/:id')
  @ApiResponse({
    status: 200,
    description: 'Finish checklist by technician',
    type: JobResDto,
  })
  @Roles(UserRole.TECHNICIAN)
  async finishChecklist(
    @Param('id') id: string,
    @Body() body: FinishChecklistReqDto,
  ) {
    const updatedJob = await this.jobService.updateFinishChecklist(body, id);

    return JobMapper.toResDto(updatedJob);
  }

  @Patch('/approveJob/:id')
  @ApiResponse({
    status: 200,
    description: 'Approve job by service advisor.',
    type: null,
  })
  @Roles(UserRole.TECHNICIAN, UserRole.SERVICE_ADVISER)
  async approvedJob(@Param('id') id: string, @Body() body: ApprovedJobReqDto) {
    await this.jobService.updateApprovedJob(body, id);
  }

  @Patch('/completeJob/:id')
  @ApiResponse({
    status: 200,
    description: 'Complete job by technician.',
    type: null,
  })
  @Roles(UserRole.TECHNICIAN)
  async completeJob(@Param('id') id: string, @Body() body: CompleteJobReqDto) {
    await this.jobService.updateCompleteJob(body, id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete job by id',
    type: null,
  })
  @Roles(UserRole.TECHNICIAN, UserRole.SERVICE_ADVISER)
  async delete(@Param('id') id: string) {
    return await this.jobService.delete(id);
  }

  @Sse('/event/job/:id')
  @Roles(UserRole.TECHNICIAN, UserRole.SERVICE_ADVISER)
  notifyJobStatus(@Param('id') jobId: string): Observable<JobStatus> {
    const notifier$ = new Subject<boolean>();
    return interval(5000).pipe(
      takeUntil(notifier$),
      switchMap(() => from(this.jobService.findById(jobId))),
      map((job: Job) => job.status),
      tap((js) => {
        if ([JobStatus.APPROVED, JobStatus.COMPLETED].includes(js)) {
          notifier$.next(true);
        }
      }),
    );
  }
}
