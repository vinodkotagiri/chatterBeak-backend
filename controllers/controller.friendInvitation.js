const User = require('../models/model.user')
const FriendInvitation = require('../models/model.friendInvitation')
const { updateFriendsPendingInvitaions, updateFriends } = require('../socketHandlers/updates/friends')
async function postInvitaion(req, res) {
	try {
		const { targetEmail } = req.body
		const { email, _id } = req.user

		if (!targetEmail) return res.status(409).send('Target email is required')
		//check if sending to self
		if (email === targetEmail.toLowerCase()) return res.status(409).send('Cannot send invitation to self')
		const targetUser = await User.findOne({ email: targetEmail.toLowerCase() })
		//check if email is regestered
		if (!targetUser) return res.status(404).send(targetEmail + ' is not registered with us. Please check the email')
		//check if invitation is already sent
		console.log(targetUser._id, _id)
		const invitationAlreadyReceived = await FriendInvitation.findOne({ senderId: _id, receiverId: targetUser._id })
		if (invitationAlreadyReceived) return res.status(400).send('Invitation has been already sent')
		//check if the users are already friends
		const alreadyFriends = await targetUser?.friends.find((id) => id.toString() === _id)
		if (alreadyFriends) return res.status(400).send('Already a friend. Check your friends list')
		//create new invitation in db
		const newInvitation = await FriendInvitation.create({ senderId: _id, receiverId: targetUser._id })
		//send pending invitation update to specific user
		updateFriendsPendingInvitaions(targetUser._id.toString())
		res.status(201).send('Invitation sent to ' + targetEmail)
	} catch (error) {
		res.status(500).send('Error occured! Please try again later.' + error)
	}
}

async function acceptInvitation(req, res) {
	try {
		const { id } = req.body
		const { _id } = req.user
		const invitation = await FriendInvitation.findById(id)
		if (!invitation) return res.status(401).send('Error occured. Please try again later')
		const { senderId, receiverId } = invitation
		//add friends to both users
		const friend1 = await User.findById(senderId)
		const friend2 = await User.findById(receiverId)
		friend1.friends = [...friend1.friends, receiverId]
		friend2.friends = [...friend2.friends, senderId]
		await friend1.save()
		await friend2.save()
		//delete invitation
		await FriendInvitation.findByIdAndDelete(id)
		//update the friends if the users are online
		updateFriends(senderId.toString())
		updateFriendsPendingInvitaions(receiverId.toString())
		res.status(200).send('Accepted request')
	} catch (error) {
		res.status(500).send('Error occured! Please try again later.' + error)
	}
}
async function rejectInvitation(req, res) {
	try {
		const { id } = req.body
		const { _id } = req.user
		const invitationExists = await FriendInvitation.exists({ _id: id })
		if (invitationExists) {
			await FriendInvitation.findByIdAndDelete(id)
		}
		updateFriendsPendingInvitaions(_id)
		res.status(200).send('Rejected Invitation')
	} catch (error) {
		res.status(500).send('Error occured! Please try again later.' + error)
	}
}
module.exports = { postInvitaion, acceptInvitation, rejectInvitation }
