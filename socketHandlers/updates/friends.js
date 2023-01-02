const User = require('../../models/model.user')
const FriendInvitation = require('../../models/model.friendInvitation')
const { getActiveConnections, getSocketServerInstance } = require('../../serverStore')
async function updateFriendsPendingInvitaions(userId) {
	try {
		const pendingInvitations = await FriendInvitation.find({
			receiverId: userId,
		}).populate('senderId', '_id userName email')
		//find if specfic userId has active connection
		const receiverList = getActiveConnections(userId)
		//emit friends-invitations event
		const io = getSocketServerInstance()
		receiverList.forEach((recevierSocketId) =>
			io.to(recevierSocketId).emit('friends-invitations', {
				pendingInvitations: pendingInvitations ? pendingInvitations : [],
			})
		)
	} catch (error) {
		console.log(error)
	}
}

async function updateFriends(userId) {
	try {
		const user = await User.findById(userId, { _id: 1, friends: 1 }).populate('friends', '_id userName email')

		const friends = user?.friends.map((friend) => ({
			id: friend._id,
			email: friend.email,
			userName: friend.userName,
		}))

		//find if specfic userId has active connection
		const receiverList = getActiveConnections(userId)
		//emit friends-invitations event
		const io = getSocketServerInstance()
		receiverList.forEach((recevierSocketId) =>
			io.to(recevierSocketId).emit('friends-list', {
				friends: friends ? friends : [],
			})
		)
	} catch (error) {
		console.log(error)
	}
}
module.exports = { updateFriendsPendingInvitaions, updateFriends }
