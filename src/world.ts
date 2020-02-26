import Snake from "./snake";
import { Server } from "socket.io";
import { NUM_COLS, GRID_SIZE, NUM_ROWS, MAX_FOOD } from "./constant";
import Food from "./food";
import ServerContext from "./server-context";

export default class World {
  snakes: {[key: string]: Snake}
  foods: Food[]
  server: Server
  context: ServerContext
  
  constructor(context: ServerContext, server: Server) {
    this.snakes = {}
    this.foods = []
    this.server = server
    this.context = context
    setInterval(this.heartbeat.bind(this), 100)
  }

  createSnake(id: string) {
    if (this.snakes[id])
      return

    const vec = this.createVector(8);
    this.snakes[id] = new Snake(vec[0], vec[1])
  }

  removeSnake(id: string) {
    console.log('remove snake ' + id)
    delete this.snakes[id]
  }

  turnSnake(id: string, direction: number) {
    if (this.snakes[id]) {
      this.snakes[id].turn(direction)
    }
  }

  private heartbeat() {
    // update world
    Object.keys(this.snakes).forEach(id => this.snakes[id].update())
    if (this.foods.length < MAX_FOOD) {
      const v = this.createVector()
      this.foods.push(new Food(v[0], v[1]))
    }

    // post update
    const snakeIds = Object.keys(this.snakes)
    for(var j = 0; j < snakeIds.length; j++) {
      const id = snakeIds[j]
      // wall check
      if (this.snakes[id].isDeath) {
        this.server.emit('dead', id)
        this.removeSnake(id)
        snakeIds.splice(snakeIds.indexOf(id), 1)
        continue
      }

      // bump to other snake?
      let isDead = false
      for (var k = 0; k < snakeIds.length; k++) {
        const otherId = snakeIds[k]
        if (id !== otherId) {
          for (var a = 0; a < this.snakes[otherId].tails.length; a++) {
            if (this.collision(this.snakes[id], this.snakes[otherId].tails[a])) {
              this.server.emit('dead', id)
              this.removeSnake(id)
              snakeIds.splice(snakeIds.indexOf(id), 1)
              isDead = true
              break
            }
          }
          if (isDead)
            break
        }
      }
      if (isDead)
        continue

      // food eating check
      for (var i = this.foods.length - 1; i >= 0; i--) {
        if (this.collision(this.snakes[id], this.foods[i])) {
          this.foods.splice(i, 1)
          this.snakes[id].total++
          this.context.players[id].score += 100
          this.server.emit('takeScore', { id, score: 100 })
        }
      }
    }
    
    this.server.emit('heartbeat', { snakes: this.snakes, foods: this.foods })
  }

  private createVector(padding = 0) {
    const x = Math.floor(Math.random() * (NUM_COLS - padding * 2)) * GRID_SIZE
    const y = Math.floor(Math.random() * (NUM_COLS - padding * 2)) * GRID_SIZE
    return [x, y]
  }

  private collision(v1: any, v2: any) {
    return v1.x === v2.x && v1.y === v2.y
  }
}