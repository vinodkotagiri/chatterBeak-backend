const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
function connectDB(URI) {
	try {
		mongoose.connect(URI, () => console.log('Database connection succesful...'))
	} catch (error) {
		console.error(error)
	}
}
module.exports = connectDB
