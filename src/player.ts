export default class Player {
  id: string
  name: string
  color: number
  score: number

  constructor(id: string, name: string, color: number) {
    this.id = id
    this.name = name
    this.color = color
    this.score = 0
  }
}