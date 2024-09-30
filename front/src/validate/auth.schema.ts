import * as Joi from "joi";

export const userRegisterSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .required()
      .label("email")
      .messages({
        "string.email": "The email is incorrect",
        "string.empty": "The email is empty.",
      }),
    name: Joi.string().min(2).max(30).trim().required().label("name").messages({
      "string.empty": "The name is empty.",
      "string.min": "The name cannot be less than 2 characters",
      "string.max": "The name cannot be more than 30 characters",
    }),
    password: Joi.string()
      .regex(/(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,30}/)
      .trim()
      .required()
      .label("password")
      .messages({
        "string.empty": "The password is empty.",
        "string.pattern.base":
          "Password may have a minimum of 8 characters, including at least one capital letter and one number",
      }),
  })
  .options({ stripUnknown: false });

export const userLoginSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .required()
      .label("email")
      .messages({
        "string.email": "The email is incorrect",
        "string.empty": "The email is empty.",
      }),
    password: Joi.string()
      .min(1)
      .max(30)
      .trim()
      .required()
      .label("password")
      .messages({
        "string.empty": "The password is empty.",
        "string.max": "The password cannot be more than 30 characters",
        "string.min": "The password cannot be less than 1 characters",
      }),
  })
  .options({ stripUnknown: false });
