import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
  convert: true,
})
export class QuerySearchDto {
  @JoiSchema(Joi.array().items(Joi.number().integer()).length(2))
  range?: [number, number];

  @JoiSchema(
    Joi.array().items(Joi.string().max(20), Joi.valid('ASC', 'DESC')).length(2),
  )
  sort?: [string, 'ASC' | 'DESC'];

  @JoiSchema(
    Joi.object().keys({
      text: Joi.string().min(1).max(2000),
      user: Joi.object().keys({
        email: Joi.string().email({ tlds: { allow: false } }),
        name: Joi.string().min(2).max(30),
      }),
    }),
  )
  filter?: {
    text?: string;
    user?: {
      email?: string;
      name?: string;
    };
  };
}
