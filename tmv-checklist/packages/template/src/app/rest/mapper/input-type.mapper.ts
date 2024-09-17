import { InputType } from 'src/app/template/entities';
import { GetAllInputTypeAPIResponse, InputTypeResDto } from '../dtos/response';
import { InputTypeReqDto } from '../dtos/request';
import { logAround } from 'src/app/logger/decorator/log-around';

export class InputTypeMapper {
  @logAround()
  static toResDto(inputType: InputType): InputTypeResDto {
    return {
      id: inputType.id,
      name: inputType.name,
      options: inputType.options,
    };
  }

  @logAround()
  static toPageResDto(inputTypes: InputType[]): GetAllInputTypeAPIResponse {
    return {
      items: inputTypes.map((inputType) => this.toResDto(inputType)),
      meta: null,
    };
  }

  @logAround()
  static toEntity(body: InputTypeReqDto): InputType {
    const inputType = new InputType();
    inputType.name = body.name;
    inputType.options = body.options;
    return inputType;
  }
}
