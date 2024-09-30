import { HttpStatus, Injectable } from '@nestjs/common';
import { filterXSS } from 'xss';
import { CustomException } from '../custom-exception';

@Injectable()
export class ValidateService {
  async sanitize(text) {
    const clearText = filterXSS(text, {
      whiteList: {
        a: ['href', 'title'],
        code: [],
        i: [],
        strong: [],
      },
    });

    const validationResult = this.validateHTML(clearText);
    if (!validationResult) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Invalid HTML tag in your text`,
      );
    }

    return clearText;
  }

  private validateHTML(text: string): boolean {
    const htmlTagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    const stack = [];
    let match: RegExpExecArray | null;

    while ((match = htmlTagRegex.exec(text)) !== null) {
      const tagName = match[1];

      if (match[0][1] === '/') {
        if (stack.length === 0 || stack.pop() !== tagName) {
          return false;
        }
      } else {
        stack.push(tagName);
      }
    }

    return stack.length === 0;
  }
}
