const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({})

const registerSchema = Joi.object({
	userName: Joi.string().min(4).max(12),
	email: Joi.string().email(),
	password: Joi.string().min(6).max(12),
})
const loginSchema = Joi.object({
	email: Joi.string().email(),
	password: Joi.string().min(6).max(12),
})
const postInvitationSchema = Joi.object({
	targetEmail: Joi.string().email(),
})
exports.validateLogin = validator.body(loginSchema)
exports.validateRegister = validator.body(registerSchema)
exports.validatePostInvitation = validator.body(postInvitationSchema)
