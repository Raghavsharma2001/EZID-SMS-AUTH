const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const isValidSignUpSchema = Joi.object({
  firstName: Joi.string().min(2).max(200).required().messages({
    "string.base": `{#label} should be a type of 'text'`,
    "string.empty": `{#label} cannot be an empty field`,
    "string.min": `{#label} should have a minimum length of {#limit}`,
    "string.max": `{#label} should have a minimum length of {#limit}`,
    "any.required": `{#label} is a required field`,
  }),
  lastName: Joi.string().trim().min(2).max(200).required().messages({
    "string.base": `{#label} should be a type of 'text'`,
    "string.empty": `{#label} cannot be an empty field`,
    "string.min": `{#label} should have a minimum length of {#limit}`,
    "string.max": `{#label} should have a minimum length of {#limit}`,
    "any.required": `{#label} is a required field`,
  }),
  phoneNumber: Joi.string().required().messages({
    "string.base": `{#label} should be a type of 'text'`,
    "string.empty": `{#label} cannot be an empty field`,
    "any.required": `{#label} is a required field`,
  }),
});

const isValidLoginSchema = Joi.object({
  phoneNumber: Joi.string().required().messages({
    "string.base": `{#label} should be a type of 'text'`,
    "string.empty": `{#label} cannot be an empty field`,
    "any.required": `{#label} is a required field`,
  }),
});

module.exports = {
  isValidLoginSchema,
  isValidSignUpSchema,
};
