const express = require('express')
const http = require('http')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const connectDB = require('./config/db')
const authRoutes = require('./routes/route.auth')
const PORT = process.env.PORT || 27570

//create express server and add middleware
const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

//add routes
app.use('/auth', authRoutes)

//create http server , connect DB and start server
const server = http.createServer(app)
server.listen(PORT, () => {
	connectDB(process.env.MONGO_URI)
	console.log('Server running on port: ' + PORT)
})
