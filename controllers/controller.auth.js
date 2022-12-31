const User = require('../models/model.user')
const { encryptPassword, verifyPassword } = require('../helpers/encryption')
const { generateToken } = require('../helpers/authentication')
async function register(req, res) {
	try {
		const { userName, email, password } = req.body
		if (!(userName && email && password)) return res.status(400).send('All fields are required')
		//check if user already exists with given userName or email
		const emailExists = await User.findOne({ email: email.toLowerCase() })
		const userNameExists = await User.findOne({ userName: userName.toLowerCase() })
		if (emailExists) return res.status(409).send('Email already exists')
		if (userNameExists) return res.status(409).send('User Name already exists')
		//encrypt password
		const hashedPassword = await encryptPassword(password, 12)
		//create a new user document
		const user = await User.create({ userName, email, password: hashedPassword })
		//generate token
		const token = generateToken(
			{ _id: user._id, email: user.email, userName: user.userName },
			process.env.JWT_SECRET,
			'7h'
		)
		const {
			password: { passwd },
			...rest
		} = user._doc
		res.status(201).json({ userInfo: rest, token })
	} catch (error) {
		res.status(500).send('Error occured! Please try again later.' + error)
	}
}
async function login(req, res) {
	try {
		const { email, password } = req.body
		if (!(email && password)) return res.status(400).send('All fields are required')
		//check for user
		const user = await User.findOne({ email: email.toLowerCase() })
		if (!user) return res.status(404).send("Email doesn't exists")
		const isPasswordValid = await verifyPassword(password, user.password)
		if (!isPasswordValid) return res.status(400).send('Invalid password')
		//generate token
		const token = generateToken(
			{ _id: user._id, email: user.email, userName: user.userName },
			process.env.JWT_SECRET,
			'7h'
		)
		const {
			password: { passwd },
			...rest
		} = user._doc
		res.status(200).json({ userInfo: rest, token })
	} catch (error) {
		res.status(500).send('Error occured! Please try again later.' + error)
	}
}
module.exports = { register, login }
