function collision(p1, p2) {
  return dist(p1.x, p1.y, p2.x, p2.y) < 1
}

function Snake() {
  this.x = 0
  this.y = 0
  this.xspeed = 1
  this.yspeed = 0
  this.heading = DIRECTION_RIGHT
  this.isDeath = false
  this.total = 0
  this.tails = []

  this.death = function() {
    console.log('Death')
    this.isDeath = true
  }

  this.update = function() {
    if (this.total === this.tails.length) {
      for(var i = 0; i < this.tails.length - 1; i++) {
        this.tails[i] = this.tails[i+1]
      }
    }
    this.tails[this.total - 1] = createVector(this.x, this.y)

    this.x += this.xspeed * GRID_SIZE
    this.y += this.yspeed * GRID_SIZE

    if (this.x < 0 || this.x >= width || this.y < 0 || this.y >= height) 
      this.death()

    for (var i = 0; i < this.tails.length; i++) {
      if (collision(this, this.tails[i])) {
        this.death()
        break
      }
    }
  }

  this.turn = function(direction) {
    if (direction === DIRECTION_UP) {
      this.xspeed = 0
      this.yspeed = -1
    } else if (direction === DIRECTION_RIGHT) {
      this.xspeed = 1
      this.yspeed = 0
    } else if (direction === DIRECTION_DOWN) {
      this.xspeed = 0
      this.yspeed = 1
    } else {
      this.xspeed = -1
      this.yspeed = 0
    }
    this.heading = direction
  }

  this.show = function() {
    fill(255,255,255)
    for(var i = 0; i < this.tails.length; i++) {
      rect(this.tails[i].x, this.tails[i].y, GRID_SIZE, GRID_SIZE)
    }
    rect(this.x, this.y, GRID_SIZE, GRID_SIZE)
  }
}