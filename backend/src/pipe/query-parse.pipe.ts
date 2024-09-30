import { PipeTransform, Injectable, HttpStatus } from '@nestjs/common';
import { CustomException } from '../services/custom-exception';

@Injectable()
export class QueryValidationPipe implements PipeTransform {
  constructor(private field: string[]) {}
  transform(value: { [key: string]: any } = {}) {
    try {
      Object.keys(value).forEach((key) => {
        if (this.field.includes(key)) {
          value[key] = JSON.parse(value[key]);
        }
      });
    } catch (e) {
      console.error(e);
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        'Wrong query parameters',
      );
    }

    return value;
  }
}
