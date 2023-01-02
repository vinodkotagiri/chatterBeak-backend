const { authSocket } = require('./middleware/auth')
const disconnectHandler = require('./socketHandlers/disconnectHandler')
const newConnectionHandler = require('./socketHandlers/newConnectionHandler')
const { setSocketServerInstance, getOnlineUsers } = require('./serverStore.js')
function registerSocketServer(server) {
	const io = require('socket.io')(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	})
	setSocketServerInstance(io)
	io.use((socket, next) => authSocket(socket, next))
	const emitOnlineUsers = () => {
		const onlineUsers = getOnlineUsers()
		io.emit('online-users', { onlineUsers })
	}
	io.on('connection', (socket) => {
		console.log('User connected: ' + socket.id)
		newConnectionHandler(socket, io)
		emitOnlineUsers()
		socket.on('disconnect', () => {
			disconnectHandler(socket)
		})
		setInterval(() => {
			emitOnlineUsers()
		}, 8000)
	})
}
module.exports = registerSocketServer
