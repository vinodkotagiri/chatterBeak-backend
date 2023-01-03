const Conversation = require('../../models/model.conversation')
const { updateChatHistory } = require('./chatUpdates')
const directChatHisoryHandler = async (socket, data) => {
	try {
		const { _id } = socket.user
		const { receiverId } = data
		const conversation = await Conversation.findOne({
			participants: { $all: [_id, receiverId] },
			type: 'DIRECT',
		})
		if (conversation) {
			updateChatHistory(conversation._id.toString(), socket.id)
		}
	} catch (error) {
		console.log(error)
	}
}
module.exports = { directChatHisoryHandler }
