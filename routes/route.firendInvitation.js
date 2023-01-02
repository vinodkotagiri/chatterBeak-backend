const express = require('express')
const { postInvitaion, acceptInvitation, rejectInvitation } = require('../controllers/controller.friendInvitation')
const { validatePostInvitation } = require('../middleware/validator')
const { isAuth } = require('../middleware/auth')
const router = express.Router()

router.post('/invite', isAuth, validatePostInvitation, postInvitaion)
router.post('/accept', isAuth, acceptInvitation)
router.post('/reject', isAuth, rejectInvitation)

module.exports = router
