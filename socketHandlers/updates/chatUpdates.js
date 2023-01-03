const Conversation = require('../../models/model.conversation')
const { getSocketServerInstance, getActiveConnections } = require('../../serverStore')
const updateChatHistory = async (conversationId, toSpecifiedSocketId = null) => {
	const conversation = await Conversation.findById(conversationId).populate({
		path: 'messages',
		model: 'Message',
		populate: {
			path: 'author',
			model: 'User',
			Select: 'userName _id',
		},
	})
	if (conversation) {
		const io = getSocketServerInstance()
		if (toSpecifiedSocketId) {
			//initial update of chat history
			return io.to(toSpecifiedSocketId).emit('direct-history', {
				messages: conversation.messages,
				participants: conversation.participants,
			})
		}
		//check if users of this conversation are online
		//if online emit them messages
		conversation.participants.forEach((userId) => {
			const activeConnections = getActiveConnections(userId.toString())

			activeConnections.forEach((socketId) => {
				io.to(socketId).emit('direct-chat-history', {
					messages: conversation.messages,
					participants: conversation.participants,
				})
			})
		})
	}
}
module.exports = { updateChatHistory }
