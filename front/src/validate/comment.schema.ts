import * as Joi from "joi";

export const commentCreateSchema = Joi.object()
  .keys({
    text: Joi.string()
      .min(1)
      .max(2000)
      .trim()
      .required()
      .label("text")
      .messages({
        "string.empty": "The text is empty.",
        "string.min": "The text cannot be less than 1 characters",
        "string.max": "The text cannot be more than 2000 characters",
      }),
  })
  .options({ stripUnknown: false });
