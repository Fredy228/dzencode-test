import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { ensureDir, unlink, pathExistsSync } from 'fs-extra';
import * as sharp from 'sharp';

import { InterfaceOptionImage } from '../../types/file-service.type';
import { CustomException } from '../custom-exception';

@Injectable()
export class FileService {
  async saveImage(
    file: Express.Multer.File,
    pathSegments: string[],
    options?: InterfaceOptionImage,
  ) {
    const fileName = `${uuidv4()}.webp`;
    const fullFilePath = join(process.cwd(), 'static', ...pathSegments);

    await ensureDir(fullFilePath);
    await sharp(file.buffer)
      .resize(options || null)
      .toFormat('webp')
      .webp({ quality: 85 })
      .toFile(join(fullFilePath, fileName));

    return join(...pathSegments, fileName);
  }

  async deleteFiles(filePaths: string[]): Promise<void> {
    try {
      filePaths.forEach((filePath: string) => {
        const fullPath = join(process.cwd(), 'static', filePath);

        const isExistFile = pathExistsSync(fullPath);
        if (isExistFile) {
          unlink(fullPath);
        }
      });
    } catch (err) {
      console.error(err);
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        'Error when deleting a file',
      );
    }
  }
}
