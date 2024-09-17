import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsAgreedUponNextStepValid } from '../../../common/decorators/is-self-agreed.decorator';

export class CompleteJobReqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  technicianSinature: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerSignature: string;

  @ApiProperty()
  @IsString()
  @IsAgreedUponNextStepValid({
    message: 'Agreed upon next steps is required when isSelfAgreed is true',
  })
  agreedUponNextStep: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isSelfAgreed: boolean;
}
