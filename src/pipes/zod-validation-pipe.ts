import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

type ErrorMessage = {
  field?: string;
  message: string;
};

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      let errors = error;

      if (error instanceof ZodError) {
        errors = error.errors.map((err) => {
          const errorMessage: ErrorMessage = {
            field: err.path.length > 0 ? err.path.join('.') : undefined,
            message: err.message,
          };

          return errorMessage;
        });
      }
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }
  }
}
