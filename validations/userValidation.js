const Joi = require('joi');

const userValidation = {
  createUser: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  
  updateUser: Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email()
  }),
  
  getUserById: Joi.object({
    id: Joi.number().integer().positive().required()
  }),
  
  deleteUser: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

module.exports = { userValidation };