const jwt = require('jsonwebtoken')
const { verifyToken } = require('../helpers/authentication.js')
function isAuth(req, res, next) {
	let token = req.body.token || req.query.token || req.headers['authorization']
	if (!token) return res.status(403).send('A token is required for authentication')
	token = token.replace(/^Bearer\s+/, '')
	const verification = verifyToken(token, process.env.JWT_SECRET)
	if (verification.error) return res.status(401).send('Invalid token')
	req.user = verification.user
	next()
}

module.exports = { isAuth }
