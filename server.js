require('dotenv').config()
const express = require('express')
const { ExpressPeerServer } = require('peer')
const port = process.env.PORT || 3000
const host = process.env.BASE_URL || 'localhost'

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/hi', (req, res) => {
    res.redirect(`/hi/${uuidV4()}`)
})

app.get('/hi/:room', (req, res) => {
    res.render('room', { roomId: req.params.room, port: port.toString(), host: host })
})

app.get('/greta', (req, res) => {
    res.render('greta', { port: port.toString(), host: host })
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

app.use('/peerjs', peerServer)