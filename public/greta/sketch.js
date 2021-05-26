let texts = [
  `Why lose time on hating her. She knows that we're losing time`,
  `Why lose time on blaming her. You know she won't give a damn`,
  `I think you have bigger sorrows. You'd rather tell me about those`,
  `Don't you think there is no tomorrow for the bloody things that you chose`,
  `&#127930;`,
  `Love me, tell me. I don't think that you are doing fine`,
  `Hold me, sorry. It's not that easy to cross the line`,
  `FOR THE PEOPLE LOSING TIME`,
  `&#127930;`,
  `So brave to make fun of her, if you don't look into her eyes`,
  `So easy to bring others down, if you can't handle your own lies`,
  `I think you have bigger troubles, you'd rather tell me about those`,
  `Let's get rid of those bubbles, enough of that overdose`,
  `Love me, tell me. I don't think that you are doing fine`,
  `Hold me, sorry. It's not that easy to cross the line`,
  `FOR THE PEOPLE LOSING TIME`,
];

let canvas;

let videoUrl = 'https://dl.dropboxusercontent.com/s/rf2mywto62mkb4s/hilke-trimmed.mov';
let videoUrl2 = 'https://dl.dropboxusercontent.com/s/oe2qqi3qf0iarqa/aline.mov?dl=0'
let videos = [];
let songUrl = 'https://dl.dropboxusercontent.com/s/zkhoe2ujn2h0uxa/greta.mp3';
let song;
let musicButton;
let heart;
let showHearts = false;
let system;

//socket stuff
const ROOM_ID = 'greta'
const socket = io('/')
let myPeer;
const peers = {}
let numberOfConnections = 0;

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

function preload() {
  song = loadSound(songUrl)
  heart = loadImage('./images/heart.png')

}

function setup() {
  canvas = createCanvas(windowWidth * 0.7, windowHeight);
  canvas.parent('canvas-holder');
  // background('rgba(0, 0, 0, 0.5)');
  noStroke()
  fill('plum');

  texts.map(createPost);

  musicButton = createButton('Play music').parent('controls').mousePressed(toggleSong);
  createButton('Love').parent('controls').mousePressed(toggleLove);
  createButton('Start camera').parent('controls').mousePressed(turnOnVideo);

  system = new ParticleSystem(createVector(width / 2, 100));

  song.addCue(2, toggleLove);
  song.addCue(5, toggleLove);
  song.addCue(83, toggleLove);
  song.addCue(89, toggleLove);
  song.addCue(94, toggleLove);
  song.addCue(99, toggleLove);
}

function draw() {
  if (showHearts) {
    // for (let i = 0; i < 20; i++) {
    //     ellipse(random(windowWidth), random(windowHeight), 10);
    // }
    system.addParticle();
    system.run();
  } else {
    clear();
  }
}

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
    videos.map(video => video.pause());
    musicButton.html('Play Music');

  } else {
    song.play();
    videos.map(sync);
    musicButton.html('Pause Music');
  }
}

function sync(video) {
  video.time(song.currentTime());
  video.play();
}

function toggleLove() {
  const logo = select('.logo');
  const header = select('.header');
  if (logo.html() === 'hatebook') {
    logo.html('lovebook');
    showHearts = true;
  } else {
    logo.html('hatebook');
    showHearts = false;
  }
  header.toggleClass('love');
}

function createPost(text, index) {
  const even = index % 2 === 0;
  const userName = even ? 'Hilke' : 'Gregory';
  const profilePic = even ? './images/hilke.png' : './images/gregory.png';
  const url = even ? videoUrl : videoUrl2;

  const postWrapper = createDiv().parent('#posts').class('post');
  const userWrapper = createDiv().parent(postWrapper).class('user-wrapper');
  createImg(profilePic, userName).parent(userWrapper).class('profile-pic');
  createSpan(userName).parent(userWrapper).class('user-name');
  createDiv(text).parent(postWrapper).class('text');
  let videoWrapper = createDiv().parent(postWrapper).class('video');

  let myVideo = createVideo(url);
  myVideo.parent(videoWrapper);
  myVideo.volume(0);
  videos.push(myVideo);

  return postWrapper;
}

///
/// PARTICLE LOGIC
///


// A simple Particle class
let Particle = function (position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-5, 5), random(-5, 5));
  this.position = position.copy();
  this.lifespan = 255;
};

Particle.prototype.run = function () {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 10;
};

// Method to display
Particle.prototype.display = function () {
  stroke(127, 0, 0, this.lifespan);
  strokeWeight(2);
  // fill(127, this.lifespan);
  // ellipse(this.position.x, this.position.y, 12, 12);
  tint(255, this.lifespan);
  image(heart, this.position.x, this.position.y, 40, 40);
};

// Is the particle still useful?
Particle.prototype.isDead = function () {
  return this.lifespan < 0;
};

let ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function () {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function () {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};
