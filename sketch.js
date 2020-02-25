/// <reference path="./node_modules/@types/p5/global.d.ts" />

var s;
var food;
var score = 0
var gamespeed = 12
var isPause = false

function setup() {
  createCanvas(MAP_WIDTH, MAP_HEIGHT)
  frameRate(gamespeed)
  textSize(18)
  s = new Snake();
  food = new Food();
}

function keyPressed() {
  if (keyCode === UP_ARROW && s.heading !== DIRECTION_DOWN) {
    s.turn(DIRECTION_UP)
  } else if (keyCode === RIGHT_ARROW && s.heading !== DIRECTION_LEFT) {
    s.turn(DIRECTION_RIGHT)
  } else if (keyCode === DOWN_ARROW && s.heading !== DIRECTION_UP) {
    s.turn(DIRECTION_DOWN)
  } else if (keyCode === LEFT_ARROW && s.heading !== DIRECTION_RIGHT) {
    s.turn(DIRECTION_LEFT)
  } 

  if (keyCode === 32) {
    isPause = !isPause
    if (isPause)
      noLoop()
    else
      loop()
  }
}

function mousePressed() {
  // frameRate(++gamespeed)
}

function draw() {
  // Calculation on each frame
  s.update()
  if (collision(s, food)) {
    s.total++
    gamespeed += 1;
    frameRate(gamespeed)
    food.respawn()
    score += 100
  }
  
  if (!s.isDeath) {
    // draw on each frame

    background(51)
    s.show()
    food.show()
    text(`Score: ${score}`, 12, height - 12)
  } else {
    background(51)
    textSize(36)
    textAlign(CENTER)
    text('GAME OVER!!', 0, height / 2 - 22, width, 36)
    text(`Your Score: ${score}`, 0, height / 2 + 22, width, 36)
    noLoop()
  }
}

