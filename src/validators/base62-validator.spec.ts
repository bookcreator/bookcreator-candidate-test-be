import { validate } from 'class-validator'; // Import class-validator's validate method
import { plainToInstance } from 'class-transformer'; // For converting plain objects to class instances
import { IsBase62 } from './base62-validator';

class TestClass {
  @IsBase62()
  value: string;
}

describe('IsBase62 Validator', () => {
  it('should pass validation for valid Base62 string', async () => {
    const testObj = plainToInstance(TestClass, { value: 'abc123XYZ' });
    const validationResults = await validate(testObj);
    expect(validationResults.length).toBe(0);
  });

  it('should fail validation for invalid Base62 string (contains special characters)', async () => {
    const testObj = plainToInstance(TestClass, { value: 'abc123!@#' });
    const validationResults = await validate(testObj);

    expect(validationResults.length).toBeGreaterThan(0);
    expect(validationResults[0].constraints?.IsBase62Constraint).toBe(
      'The value (abc123!@#) is not a valid Base62 string and therefore cannot be a valid short link',
    );
  });

  it('should fail validation for invalid Base62 string (contains spaces)', async () => {
    const testObj = plainToInstance(TestClass, { value: 'abc 123' });
    const validationResults = await validate(testObj);

    expect(validationResults.length).toBeGreaterThan(0);
    expect(validationResults[0].constraints?.IsBase62Constraint).toBe(
      'The value (abc 123) is not a valid Base62 string and therefore cannot be a valid short link',
    );
  });

  it('should fail validation for invalid Base62 string (empty string)', async () => {
    const testObj = plainToInstance(TestClass, { value: '' });
    const validationResults = await validate(testObj);

    expect(validationResults.length).toBeGreaterThan(0);
    expect(validationResults[0].constraints?.IsBase62Constraint).toBe(
      'The value () is not a valid Base62 string and therefore cannot be a valid short link',
    );
  });
});
