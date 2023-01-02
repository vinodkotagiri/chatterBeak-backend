const connectedUsers = new Map()
let io = null
function setSocketServerInstance(ioInstance) {
	io = ioInstance
}
function getSocketServerInstance() {
	return io
}
const addNewConnectedUser = ({ socketId, userId }) => {
	connectedUsers.set(socketId, { userId })
	console.log('new connected users')
	console.log(connectedUsers)
}
const removeConnectedUser = (socketId) => {
	if (connectedUsers.has(socketId)) {
		connectedUsers.delete(socketId)
		console.log('new connected users')
		console.log(connectedUsers)
	}
}
const getActiveConnections = (userId) => {
	const activeConnections = []
	connectedUsers.forEach((value, key) => {
		if (value.userId === userId) {
			activeConnections.push(key)
		}
	})
	return activeConnections
}

const getOnlineUsers = () => {
	const onlineUsers = []
	connectedUsers.forEach((value, key) => {
		onlineUsers.push({ socketId: key, userId: value.userId })
	})
	return onlineUsers
}
module.exports = {
	addNewConnectedUser,
	removeConnectedUser,
	getActiveConnections,
	getSocketServerInstance,
	setSocketServerInstance,
	getOnlineUsers,
}
