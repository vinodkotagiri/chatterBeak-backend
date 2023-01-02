const { addNewConnectedUser } = require('../serverStore')
const { updateFriendsPendingInvitaions, updateFriends } = require('./updates/friends')
async function newConnectionHandler(socket, io) {
	const userDetails = socket.user
	addNewConnectedUser({ socketId: socket.id, userId: userDetails._id })
	updateFriendsPendingInvitaions(userDetails._id)
	updateFriends(userDetails._id)
}
module.exports = newConnectionHandler
