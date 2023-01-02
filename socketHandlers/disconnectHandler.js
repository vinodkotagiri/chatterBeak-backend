const { removeConnectedUser } = require('../serverStore')
async function disconnectHandler(socket, io) {
	const userDetails = socket.user
	removeConnectedUser(socket.id)
}
module.exports = disconnectHandler
