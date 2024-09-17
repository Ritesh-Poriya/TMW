import { Industry } from 'src/app/template/entities';
import {
  GetAllIndustriesAPIResponse,
  IndustryAPIResponse,
} from '../dtos/response';
import { PaginationResponse } from 'src/app/common/pagination';
import { IndustryRequestBody } from '../dtos/request';
import { logAround } from 'src/app/logger/decorator/log-around';

export class IndustryMapper {
  @logAround()
  static toResDTO(industry: Industry): IndustryAPIResponse {
    return {
      id: industry.id,
      name: industry.name,
      description: industry.description,
      logoUrl: industry.logoUrl,
    };
  }

  @logAround()
  static toPaginationResDTO(
    data: PaginationResponse<Industry>,
  ): GetAllIndustriesAPIResponse {
    return {
      items: data.items.map((industry) => this.toResDTO(industry)),
      meta: data.meta,
    };
  }

  @logAround()
  static toIndustry(dto: IndustryRequestBody): Industry {
    const industry = new Industry();
    industry.name = dto.name;
    industry.description = dto.description;
    industry.logoUrl = dto.logoUrl;
    return industry;
  }
}
