import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class LoginAuthDto {
  @JoiSchema(
    Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'The email is incorrect',
        'string.empty': 'The email is empty.',
      }),
  )
  email: string;

  @JoiSchema(
    Joi.string().min(1).max(30).required().messages({
      'string.empty': 'The password is empty.',
      'string.max': 'The password cannot be more than 30 characters',
      'string.min': 'The password cannot be less than 1 characters',
    }),
  )
  password: string;

  @JoiSchema(
    Joi.string().required().messages({
      'string.empty': 'The name is empty.',
    }),
  )
  captcha: string;
}

export class RegisterAuthDto extends LoginAuthDto {
  @JoiSchema(
    Joi.string().min(2).max(30).required().messages({
      'string.empty': 'The name is empty.',
      'string.min': 'The name cannot be less than 2 characters',
      'string.max': 'The name cannot be more than 30 characters',
    }),
  )
  name: string;

  @JoiSchema(
    Joi.string()
      .regex(/(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,30}/)
      .required()
      .messages({
        'string.empty': 'The password is empty.',
        'string.pattern.base':
          'Password may have a minimum of 8 characters, including at least one capital letter and one number',
      }),
  )
  password: string;
}
