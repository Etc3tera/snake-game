import Vector from './vector'
import { GRID_SIZE, DIRECTION_UP, DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_LEFT, MAP_WIDTH, MAP_HEIGHT, NUM_COLS, NUM_ROWS } from './constant'

export default class Snake {
  x: number
  y: number
  xspeed: number
  yspeed: number
  heading: number
  total: number
  tails: Vector[]
  canMove: boolean

  constructor(startX: number, startY: number) {
    this.tails = []
    this.x = startX
    this.y = startY
    this.xspeed = 1
    this.yspeed = 0
    this.heading = DIRECTION_RIGHT
    this.total = 0
    this.canMove = true
  }

  update() {
    if (!this.canMove)
      return

    if (this.total === this.tails.length) {
      for(var i = 0; i < this.tails.length - 1; i++) {
        this.tails[i] = this.tails[i+1]
      }
    }
    this.tails[this.total - 1] = new Vector(this.x, this.y)

    this.x += this.xspeed * GRID_SIZE
    this.y += this.yspeed * GRID_SIZE

    // this.xspeed = 0
    // this.yspeed = 0

    if (this.x < 0)
      this.x = (NUM_COLS - 1) * GRID_SIZE
    if (this.x > MAP_WIDTH)
      this.x = 0
    if (this.y < 0)
      this.y = (NUM_ROWS - 1) * GRID_SIZE
    if (this.y > MAP_HEIGHT)
      this.y = 0
  }

  turn (direction: number) {
    if (direction === DIRECTION_UP && this.heading !== DIRECTION_DOWN) {
      this.xspeed = 0
      this.yspeed = -1
      this.heading = DIRECTION_UP
    } else if (direction === DIRECTION_RIGHT && this.heading !== DIRECTION_LEFT) {
      this.xspeed = 1
      this.yspeed = 0
      this.heading = DIRECTION_RIGHT
    } else if (direction === DIRECTION_DOWN && this.heading !== DIRECTION_UP) {
      this.xspeed = 0
      this.yspeed = 1
      this.heading = DIRECTION_DOWN
    } else if (direction === DIRECTION_LEFT && this.heading !== DIRECTION_RIGHT) {
      this.xspeed = -1
      this.yspeed = 0
      this.heading = DIRECTION_LEFT
    }
  }

  stop() {
    this.canMove = false
  }

  resume() {
    this.canMove = true
  }
}