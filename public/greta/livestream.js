const ROOM_ID = 'greta'
const socket = io('/')
let myPeer
const peers = {}
let numberOfConnections = 0
let availableSpots = 5

const withTalk = window.location.search === '?talk'

function turnOnVideo() {
  myPeer = new Peer(undefined, {
    PEER_CONFIG
  })

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: withTalk
  }).then(setUpStream)

  myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
  })
  if (( window.innerWidth > 800 ) && ( window.innerHeight > 600 )) {
    document.querySelector('#chat').style.display = 'block'
  }
  
}

function setUpStream(stream) {
  document.querySelector('#streams-count').style.display = 'block'
  const myVideo = document.createElement('video')
  myVideo.muted = true
  myVideo.playsinline = true
  myVideo.width = 570
  myVideo.height = 360
  addMyVideoStream(myVideo, stream)

  myPeer.on('call', call => {
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
  let videoContainer
  call.on('stream', userVideoStream => {
    videoContainer = addVideoStreamToPost(userVideoStream)
  })
  call.on('close', () => {
    numberOfConnections--
    availableSpots++
    // replace it again with one of the recorded videos
    const url = videoContainer.dataset.even === 'true' ? videoUrl : videoUrl2
    const recordedVideo = createVideo(url)
    recordedVideo.elt.muted = true
    recordedVideo.elt.playsInline = true
    videoContainer.replaceChild(recordedVideo.elt, videoContainer.firstElementChild)
    videos.push(recordedVideo)
    if (song.isPlaying()) {
      recordedVideo.play()
    }
  })

  peers[userId] = call
}

function addVideoStreamToPost(stream) {
  const video = document.createElement('video')
  video.width = 570
  video.height = 360
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  const container = document.getElementsByClassName('video')[numberOfConnections * 3 + 1]
  container.replaceChild(video, container.firstElementChild)
  numberOfConnections++
  availableSpots--
  if (availableSpots < 1){
    texts.map(createPost)
    availableSpots = 5
  }
  return container
}

function addMyVideoStream(video, stream) {
  video.srcObject = stream
  video.width = 570
  video.height = 360
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  const container = document.getElementsByClassName('video')[0]
  container.replaceChild(video, container.firstElementChild)
}