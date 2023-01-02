const express = require('express')
const http = require('http')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const connectDB = require('./config/db')
const authRoutes = require('./routes/route.auth')
const friendInvitaionRoutes = require('./routes/route.firendInvitation')
const PORT = process.env.PORT || 27570
const registerSocketServer = require('./socketServer')
//create express server and add middleware
const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

//add routes
app.use('/auth', authRoutes)
app.use('/friend-invitation', friendInvitaionRoutes)
//create http server , connect DB and start server
const server = http.createServer(app)
//Register socket server
registerSocketServer(server)
server.listen(PORT, () => {
	connectDB(process.env.MONGO_URI)
	console.log('Server running on port: ' + PORT)
})
