/// <reference path="../node_modules/@types/p5/global.d.ts" />

var snakes = {};
var foods = [];
var players = {}
var isGameover = false

function setup() {
  const name = prompt('Please Enter Your name:', 'Anonymous'+Math.floor(Math.random() * 30000))
  socket.emit('join', name)
  createCanvas(MAP_WIDTH, MAP_HEIGHT)
  frameRate(10)
}

function keyPressed() {
  if (keyCode === UP_ARROW || keyCode === 87) {
    socket.emit('turn', DIRECTION_UP)
  } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
    socket.emit('turn', DIRECTION_RIGHT)
  } else if (keyCode === DOWN_ARROW || keyCode === 83) {
    socket.emit('turn', DIRECTION_DOWN)
  } else if (keyCode === LEFT_ARROW || keyCode === 65) {
    socket.emit('turn', DIRECTION_LEFT)
  } 

  if (keyCode === 32) {
    if (isGameover) {
      isGameover = false
      socket.emit('respawn')
      loop()
    }
  }
}

function draw() {
  background(51)
  drawSnake()
  drawFood()
  if (isGameover) {
    background(51)
    fill(255, 100, 0)
    textSize(36)
    textAlign(CENTER)
    text('Press SPACE to respawn', 0, height / 2 - 22, width, 36)
    text(`Your Current Score: ${players[socket.id].score}`, 0, height / 2 + 22, width, 36)
    noLoop()
  }
}
