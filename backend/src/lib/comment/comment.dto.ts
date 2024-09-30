import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CommentDTO {
  @JoiSchema(
    Joi.number().integer().allow(null).messages({
      'number.empty': 'The id is empty.',
      'number.integer': 'The id must be integer',
    }),
  )
  parentCommentId?: number;

  @JoiSchema(
    Joi.string().min(1).max(2000).required().messages({
      'string.empty': 'The message is empty.',
      'string.min': 'The message cannot be less than 1 characters',
      'string.max': 'The message cannot be more than 2000 characters',
    }),
  )
  text: string;
}
