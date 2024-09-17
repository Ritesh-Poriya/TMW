import { BillingContact } from 'src/app/company/entities';
import { CompanyBillingContactReqDto } from '../dtos/requests';
import { CompanyBillingContactRes } from '../dtos/responses';

export class BillingContactMapper {
  static toEntity(
    billingContactDto: CompanyBillingContactReqDto,
  ): BillingContact {
    const entity = new BillingContact();
    entity.firstName = billingContactDto.firstName;
    entity.lastName = billingContactDto.lastName;
    entity.email = billingContactDto.email;
    entity.phone = billingContactDto.phone;
    return entity;
  }

  static toDto(billingContactEntity: BillingContact): CompanyBillingContactRes {
    return {
      id: billingContactEntity.id,
      firstName: billingContactEntity.firstName,
      lastName: billingContactEntity.lastName,
      email: billingContactEntity.email,
      phone: billingContactEntity.phone,
    };
  }
}
