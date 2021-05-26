const ROOM_ID = 'greta'
const socket = io('/')
let myPeer
const peers = {}
let numberOfConnections = 0

function turnOnVideo() {
  myPeer = new Peer(undefined, {
    PEER_CONFIG
  })

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(setUpStream)

  myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
    console.log('opening socket')
  })
}

function setUpStream(stream) {
  console.log('opened camera')
  const myVideo = document.createElement('video')
  myVideo.muted = true
  addMyVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    console.log('call start')
    call.answer(stream)
    call.on('stream', userVideoStream => {
      addVideoStreamToPost(userVideoStream);
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
};


socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})


function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  call.on('stream', userVideoStream => {
    console.log('adding new user stream')
    addVideoStreamToPost(userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStreamToPost(stream) {
  const video = document.createElement('video')
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  const container = document.getElementsByClassName('video')[numberOfConnections * 3 + 1]
  container.replaceChild(video, container.firstElementChild)
  numberOfConnections++
}

function addMyVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  const container = document.getElementsByClassName('video')[0]
  container.replaceChild(video, container.firstElementChild)
}