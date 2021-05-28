require('dotenv').config()
const express = require('express')
const { ExpressPeerServer } = require('peer')
const port = process.env.PORT || 3000
const host = process.env.BASE_URL || 'localhost'
const peerConfig = host === 'localhost' ? {
    path: '/peerjs/server',
    port: port.toString(),
    host: host
} : {
    path: '/peerjs/server',
    host: host
}

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/press', (req, res) => {
    res.render('press')
})

app.get('/team', (req, res) => {
    res.render('team')
})

app.get('/greta', (req, res) => {
    res.render('greta', { peerConfig: peerConfig })
})

app.get('/hi', (req, res) => {
    res.redirect(`/hi/${uuidV4()}`)
})

app.get('/hi/:room', (req, res) => {
    res.render('room', { roomId: req.params.room, peerConfig: peerConfig })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log('someone joined', roomId, userId)
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })

        socket.on("chat message", function (data) {
            console.log(data)
            io.emit("chat message", data)
        });
    })
})

server.listen(port)

const peerServer = ExpressPeerServer(server, {
    path: '/server'
})

app.use('/peerjs', peerServer)