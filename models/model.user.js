const mongoose = require('mongoose')
const { Schema, model } = mongoose
const userSchema = new Schema(
	{
		userName: { type: String, unique: true, required: true, lowercase: true },
		email: { type: String, unique: true, unique: true, lowercase: true },
		password: { type: String, required: true },
		friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
)
module.exports = model('User', userSchema)
