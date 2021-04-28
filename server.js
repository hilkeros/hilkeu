require('dotenv').config()
const express = require('express')
const { ExpressPeerServer } = require('peer')
const port = process.env.PORT || 3000
const host = process.env.BASE_URL || 'localhost'

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/greta', (req, res) => {
  res.render('greta', { roomId: 'greta', port: port.toString(), host: host })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(port)

const peerServer = ExpressPeerServer(server, {
  path: '/server'
})
