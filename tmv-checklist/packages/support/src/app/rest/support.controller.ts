import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SupportReqDto } from './dtos/requests';
import { SupportResDto } from './dtos/responses';
import { SupportMapper } from './mappers';
import { SupportService } from '../support/support.service';
import { UserAuthData } from '../auth/decorators';
import { AuthorizeResType, UserRole } from '../auth/@types';
import { CompanyService } from '../company/company.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { TicketResolveReqDto } from './dtos/requests/ticket-resolve.dto';

@ApiTags('Support')
@Controller()
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private companyService: CompanyService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'The support ticket has been successfully created.',
    type: SupportResDto,
  })
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TECHNICIAN, UserRole.SERVICE_ADVISER)
  async create(
    @Body() body: SupportReqDto,
    @UserAuthData() userAuthData: AuthorizeResType,
  ): Promise<SupportResDto> {
    const support = SupportMapper.toEntity(body, userAuthData);
    const company = await this.companyService.getCompanyMyDetails();
    const result = await this.supportService.raiseTicket(
      support,
      company,
      userAuthData,
    );

    return SupportMapper.toResDto(result);
  }

  @ApiResponse({
    status: 200,
    description: 'The ticket resolve by company.',
    type: null,
  })
  @Patch('/ticket-resolve/:id')
  @Roles(UserRole.SUPER_ADMIN)
  async ticketResolve(
    @Param('id') id: string,
    @Body() body: TicketResolveReqDto,
  ) {
    await this.supportService.ticketResolve(body, id);
  }
}
