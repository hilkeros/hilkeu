function Heart(x, y, w) {
  var options = {
    friction: 0.4,
    restitution: 0.4
  };

  this.lifespan = 255;
  this.w = w;
  let scaledVertices = Vertices.scale(heartVertices, this.w/200, this.w/200);
  this.body = Bodies.fromVertices(x, y, scaledVertices, options);
 
  World.add(world, this.body);

  this.show = function () {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    stroke(255);
    imageMode(CENTER);
    tint(255, this.lifespan);
    image(lifespanToHeartImage(this.lifespan), 0, 0, this.w, this.w);
    pop();

    this.lifespan = this.lifespan - 80/this.lifespan;
  };

  this.isDead = function () {
    return this.lifespan < 0;
  }

  this.die = function () {
    World.remove(world, this.body);
  }
}

function lifespanToHeartImage(lifespan){
  if (lifespan <= 100) {
    return blueHeartImage;
  } else if (lifespan <= 150) {
    return purpleHeartImage;
  }
  return heartImage;

}