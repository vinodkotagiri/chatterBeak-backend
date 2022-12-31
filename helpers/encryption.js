const bcrypt = require('bcryptjs')
/**
 *
 * @param {string} password
 * @param {number} salt
 * @returns {string}
 */
async function encryptPassword(password, salt) {
	const hashedPassword = bcrypt.hashSync(password, salt)
	return hashedPassword
}
/**
 *
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {boolean}
 */
async function verifyPassword(password, hashedPassword) {
	return bcrypt.compare(password, hashedPassword)
}
module.exports = { encryptPassword, verifyPassword }
