let canvas

const { Engine, World, Bodies, Svg, Vertices } = Matter
let engine
let world
let hearts = []
let ground
let heartImage, purpleHeartImage, blueHeartImage
let heartVertices
let path
let logo
let header

let song
let musicButton, mobilePlayButton, mobilePauseButton

let videos = []
let stroboOn = false
let backgroundImage

function preload() {
  heartImage = loadImage('images/heart.png')
  purpleHeartImage = loadImage('images/heartpurple.png')
  blueHeartImage = loadImage('images/heartblue.png')
  backgroundImage = loadImage('images/background.png')

  song = loadSound(songUrl)
}

function setup() {
  const withCameraButton = select('#start-with-camera')
  withCameraButton.show()
  const withoutCameraButton = select('#start-without-camera')
  withoutCameraButton.show()
  withCameraButton.mousePressed(hideStartModalAndStartCamera)
  withoutCameraButton.mousePressed(hideStartModal)

  canvas = createCanvas(windowWidth, windowHeight)
  canvas.parent('canvas-holder')
  rectMode(CENTER)
  engine = Engine.create()
  world = engine.world
  let options = {
    isStatic: true
  }

  ground = Bodies.rectangle(width / 2, height, width, 2, options)
  World.add(world, ground)

  path = document.getElementById('heart-path')
  heartVertices = Svg.pathToVertices(path)
  heartVertices = decomp.quickDecomp(heartVertices)

  texts.map(createPost)

  let loveButton = select('#love')
  loveButton.mousePressed(showHearts)
  let mobileLoveButton = select('#mobile-love')
  mobileLoveButton.mousePressed(showHearts)

  musicButton = select('#music')
  musicButton.mousePressed(toggleSong)
  mobilePlayButton = select('#mobile-play')
  mobilePauseButton = select('#mobile-pause')
  mobilePlayButton.mousePressed(mobilePlaySong)
  mobilePauseButton.mousePressed(mobilePauseSong)

  let cameraButton = select('#camera')
  cameraButton.mousePressed(turnOnVideo)
  let mobileCameraButton = select('#mobile-camera')
  mobileCameraButton.mousePressed(turnOnVideo)

  let stroboButton = select('#share')
  stroboButton.mousePressed(toggleStrobo)

  logo = select('.logo')
  header = select('.header')

  song.addCue(83.5, showHearts)
  song.addCue(88.8, hideHearts)
  song.addCue(94, showHearts)
  song.addCue(99.2, hideHearts)
  song.addCue(104.5, toggleStrobo)
  song.addCue(125.2, toggleStrobo)
  song.addCue(187.5, showHearts)
  song.addCue(192.2, hideHearts)
  song.addCue(198.2, showHearts)
  song.addCue(203.8, hideHearts)
  song.addCue(208.5, toggleStrobo)
  song.addCue(229.5, toggleStrobo)

  song.onended(songEnded)
}

function draw() {
  if (stroboOn) {
    clear()
    tint(255, random(150, 255))
    image(backgroundImage, 0, 0, width, height)
  } else {
    clear()
  }

  select('#streams-count').html(numberOfConnections + 1)

  Engine.update(engine, 1000 / 30)

  hearts.map((heart, index) => {
    heart.show()
    if (heart.isDead()) {
      heart.die()
      hearts.splice(index, 1)
    }
  })

  if (song.isPlaying()) {
    if (frameCount % 60 === 0) {
      videos.map(sync)
    }
  }

}

windowResized = function () {
  resizeCanvas(windowWidth, windowHeight)
}

function hideStartModal() {
  select('#start').hide()
  select('.header').style('display', 'flex')
  select('.container').style('display', 'flex')
}

function hideStartModalAndStartCamera() {
  hideStartModal()
  turnOnVideo()
}

function showHearts() {
  for (let i = 0; i < 12; i++) {
    hearts.push(new Heart(random(width / 2) + width / 4, random(height / 5), 200))
  }

  logo.html('lovebook')
  header.removeClass('hate')
  header.addClass('love')
  setTimeout(hideHearts, 4000)
}

function hideHearts() {
  header.removeClass('love')
  header.addClass('hate')
  setTimeout(() => setLogo('hatebook'), 2000)
}

function setLogo(text) {
  logo.html(text)
}

function toggleStrobo() {
  stroboOn = !stroboOn
}

function mobilePauseSong() {
  mobilePlayButton.show()
  mobilePauseButton.hide()
  toggleSong()
}

function mobilePlaySong() {
  mobilePlayButton.hide()
  mobilePauseButton.show()
  toggleSong()
}

function toggleSong() {
  if (song.isPlaying()) {
    song.pause()
    videos.map(video => video.pause())
    musicButton.html('play music')

  } else {
    song.play()
    videos.map(video => video.play())
    musicButton.html('pause music')
  }
}

function songEnded() {
  musicButton.html('play music')
  mobilePlayButton.show()
  mobileStopButton.hide()
}

function sync(video) {
  const drift = abs(song.currentTime() - video.time())
  if (drift > 0.1) {
    video.time(song.currentTime())
  }
}

function createPost(text, index) {
  const even = index % 2 === 0
  const userName = even ? 'hilke' : 'gregory'
  const profilePic = even ? 'images/hilke.png' : 'images/gregory.png'
  const url = even ? videoUrl : videoUrl2

  const postWrapper = createDiv().parent('#posts').class('post')
  const userWrapper = createDiv().parent(postWrapper).class('user-wrapper')
  createImg(profilePic, userName).parent(userWrapper).class('profile-pic')
  createSpan(userName).parent(userWrapper).class('user-name')
  createDiv(text).parent(postWrapper).class('text')

  let videoWrapper = createDiv().parent(postWrapper).class('video')
  videoWrapper.attribute('data-even', even)
  let myVideo = createVideo(url)
  myVideo.parent(videoWrapper)
  myVideo.elt.muted = true
  myVideo.elt.playsInline = true
  videos.push(myVideo)

  return postWrapper
}



/* TO DO:
- share? links to spotify etc.
- big screens
- chat
- different heart sizes
 */