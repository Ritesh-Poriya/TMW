import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAgreedUponNextStepValid(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAgreedUponNextStepValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isSelfAgreed = args.object['isSelfAgreed'];
          if (isSelfAgreed) {
            return !!value; // if isSelfAgreed is true, agreedUponNextStep should not be empty
          } else {
            return !value; // if isSelfAgreed is false, agreedUponNextStep can be empty
          }
        },
      },
    });
  };
}
