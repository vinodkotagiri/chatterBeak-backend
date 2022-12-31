const express = require('express')
const { login, register } = require('../controllers/controller.auth')
const { validateLogin, validateRegister } = require('../middleware/validator')
const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)

module.exports = router
