import Snake from "./snake";
import { Server } from "socket.io";
import { NUM_COLS, GRID_SIZE, NUM_ROWS, MAX_FOOD, FOOD_APPLE, FOOD_STAR, FOOD_CLOCK } from "./constant";
import Food from "./food";
import ServerContext from "./server-context";

export default class World {
  foodLocation: {[key:number]: {[key:number]: boolean}}

  snakes: {[key: string]: Snake}
  foods: Food[]
  server: Server
  context: ServerContext

  usedTheWorld: boolean
  
  constructor(context: ServerContext, server: Server) {
    this.snakes = {}
    this.foods = []
    this.server = server
    this.context = context
    this.foodLocation = {}
    this.usedTheWorld = false
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
    while (this.foods.length < MAX_FOOD) {
      const v = this.createVector()
      const newFood = new Food(v[0], v[1])
      if (this.usedTheWorld && newFood.type === FOOD_CLOCK)
        continue
      this.foods.push(newFood)
    }

    // post update
    const snakeIds = Object.keys(this.snakes)
    for(var j = 0; j < snakeIds.length; j++) {
      const id = snakeIds[j]

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

              // killer got 500 point
              this.context.players[otherId].score += 500
              this.server.emit('takeScore', { id: otherId, score: 500 })
              
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
          const eaten = this.foods[i]
          this.foods.splice(i, 1)

          if (eaten.type === FOOD_APPLE || eaten.type === FOOD_STAR)
            this.snakes[id].total++

          let gainScore = 0
          if (eaten.type === FOOD_APPLE) 
            gainScore = 100
          else if (eaten.type === FOOD_STAR)
            gainScore = 300
          else {
            this.freezeOtherSnake(id)
            
          }

          if (gainScore > 0) {
            this.context.players[id].score += gainScore
            this.server.emit('takeScore', { id, score: gainScore })
          }
        }
      }
    }
    
    this.server.emit('heartbeat', { snakes: this.snakes, foods: this.foods })
  }

  private freezeOtherSnake(userId: string) {
    this.usedTheWorld = true
    Object.keys(this.snakes).forEach(id => {
      if (id !== userId)
        this.snakes[id].stop()
    })
    setTimeout(() => {
      Object.keys(this.snakes).forEach(id => {
        if (id !== userId)
          this.snakes[id].resume()
      })
      this.usedTheWorld = false
    }, 5000)
  }

  private createVector(padding = 0) {
    let rndCol, rndRow
    do{ 
      rndRow = Math.floor(Math.random() * (NUM_COLS - padding * 2))
      rndCol = Math.floor(Math.random() * (NUM_ROWS - padding * 2))
    } while(this.foodLocation[rndRow] && this.foodLocation[rndRow][rndCol])
    const x = rndRow * GRID_SIZE
    const y = rndCol * GRID_SIZE
    return [x, y]
  }

  private collision(v1: any, v2: any) {
    return v1.x === v2.x && v1.y === v2.y
  }
}