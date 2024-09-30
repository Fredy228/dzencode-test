import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CustomException } from '../services/custom-exception';

type TFile = {
  [key: string]: Array<Express.Multer.File>;
};
@Injectable()
export class FileValidatorPipe implements PipeTransform {
  constructor(
    private options: Array<{
      maxSize: number;
      mimetype?: string;
      type?: string[];
    }>,
  ) {}

  transform(files: TFile, { type }: ArgumentMetadata) {
    if (['query', 'body', 'param'].includes(type)) {
      return files;
    }

    console.log('Pipe - type:', type);

    for (const key in files) {
      if (Object.prototype.hasOwnProperty.call(files, key)) {
        files[key].forEach((item: Express.Multer.File) => {
          const settings = this.options.find(
            (i) => i.mimetype === item.mimetype.split('/')[0],
          );
          if (!settings)
            throw new CustomException(
              HttpStatus.BAD_REQUEST,
              `You are uploading the wrong file format`,
            );

          if (
            settings.type &&
            !settings.type.includes(item.mimetype.split('/')[1])
          )
            throw new CustomException(
              HttpStatus.BAD_REQUEST,
              `You are uploading the wrong file format`,
            );

          if (item.size / 1024 > settings.maxSize)
            throw new CustomException(
              HttpStatus.BAD_REQUEST,
              `The file is too large. Maximum size ${settings.maxSize} KB`,
            );
        });
      }
    }

    return files;
  }
}
