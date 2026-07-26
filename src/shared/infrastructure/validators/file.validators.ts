import {
  ValidationArguments,
  ValidationOptions,
  ValidatorOptions,
  registerDecorator,
} from 'class-validator';

export function IsMaxFileSize(
  maxSizeBytes: number,
  validatorOptions?: ValidatorOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMaxFileSize',
      target: object.constructor,
      propertyName: propertyName,
      options: validatorOptions,
      validator: {
        validate(file: Express.Multer.File) {
          if (!file) return true;
          return file.size <= maxSizeBytes;
        },
        defaultMessage(args: ValidationArguments) {
          const limitMb = (maxSizeBytes / (1024 * 1024)).toFixed(1);
          return `File size must not exceed ${limitMb}`;
        },
      },
    });
  };
}

export function IsFileMimeType(
  allowedTypes: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFileMimeType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(file: Express.Multer.File) {
          if (!file) return true;
          return allowedTypes.includes(file.mimetype);
        },
        defaultMessage(args: ValidationArguments) {
          return `Invalid file type. Allowed formats: ${allowedTypes.join(',')}`;
        },
      },
    });
  };
}
