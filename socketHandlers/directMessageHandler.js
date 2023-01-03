const Message = require('../models/model.message')
const Conversation = require('../models/model.conversation')
const { updateChatHistory } = require('./updates/chatUpdates')
const directMessageHandler = async (socket, data) => {
	try {
		const { _id } = socket.user
		const { receiverUserId, content } = data
		//create new message
		const message = await Message.create({ content, author: _id, date: new Date(), type: 'DIRECT' })
		// check if this conversation exists if not create a new conversation,
		const conversation = await Conversation.findOne({
			participants: { $all: [_id, receiverUserId] },
		})
		if (conversation) {
			conversation.messages.push(message._id)
			await conversation.save()
			updateChatHistory(conversation._id.toString())
		} else {
			const newConversation = await Conversation.create({
				messages: [message._id],
				participants: [_id, receiverUserId],
			})
			//update sender and receiver if is online
			updateChatHistory(newConversation._id.toString())
		}
	} catch (error) {
		console.log(error)
	}
}
module.exports = { directMessageHandler }
