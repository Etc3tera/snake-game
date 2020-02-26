import { FOOD_CLOCK, FOOD_APPLE, FOOD_STAR } from "./constant"

export default class Food {
  x: number
  y: number
  type: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.type = this.randomFood()
  }

  private randomFood() : number {
    let x = Math.random()
    if (x < 0.1) {
      return FOOD_CLOCK
    } else {
      x = Math.random()
      if (x < 0.5)
        return FOOD_APPLE
      else
        return FOOD_STAR
    }
  }
}