import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const resendSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required field email",
    "string.email": "Invalid email format",
  }),
});