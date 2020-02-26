import Player from "./player";

export default class ServerContext {
  players: {[key: string]: Player}

  constructor(players: {[key: string]: Player}) {
    this.players = players
  }
}