const jwt = require('jsonwebtoken')
/**
 *
 * @param {object} data
 * @param {string} secret
 * @param {string} expiry
 * @returns {string}
 */
function generateToken(data, secret, expiry) {
	const token = jwt.sign(data, secret, { expiresIn: expiry })
	return token
}
function verifyToken(token, secret) {
	try {
		const decoded = jwt.verify(token, secret)
		return { user: decoded }
	} catch (error) {
		return { error: true }
	}
}
module.exports = { generateToken, verifyToken }
