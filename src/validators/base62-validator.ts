import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
/**
 * Actual base62 validator implementation to be registered under a custom decorator below
 */
class IsBase62Constraint implements ValidatorConstraintInterface {
  validate(value: string) {
    // Check if the string only contains Base62 characters
    return typeof value === 'string' && /^[A-Za-z0-9]+$/.test(value);
  }

  defaultMessage() {
    return 'The value ($value) is not a valid Base62 string and therefore cannot be a valid short link';
  }
}

/**
 * NestJS decorator to enforce a base62 string as input, as this is the chosen shortening method for this application
 */
export function IsBase62() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      validator: IsBase62Constraint,
    });
  };
}
