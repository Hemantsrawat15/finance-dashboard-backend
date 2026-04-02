const Joi = require('joi');

const createRecordSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required()
    .messages({ 'number.positive': 'Amount must be a positive number' }),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().min(2).max(50).required(),
  date: Joi.date().iso().required(),
  description: Joi.string().max(500).optional().allow(''),
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().positive().precision(2).optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string().min(2).max(50).optional(),
  date: Joi.date().iso().optional(),
  description: Joi.string().max(500).optional().allow(''),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(422).json({ success: false, errors });
  }
  next();
};

module.exports = { createRecordSchema, updateRecordSchema, validate };