function Food() {
  this.x
  this.y

  this.respawn = function() {
    this.x = floor(random(NUM_ROWS)) * GRID_SIZE
    this.y = floor(random(NUM_ROWS)) * GRID_SIZE
  }

  this.show = function() {
    fill(255, 100, 0)
    rect(this.x, this.y, GRID_SIZE, GRID_SIZE)
  }

  // initialize
  this.respawn();
}