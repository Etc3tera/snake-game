import express from 'express'
import Http from 'http'
import Socket from 'socket.io'
import * as path from 'path'

import World from './world'
import Player from './player'
import ServerContext from './server-context'

const app = express()
const http = Http.createServer(app)
const io = Socket(http)
let counter = 0

const player: {[key: string]: Player} = {}
const world = new World(new ServerContext(player), io)

app.use(express.static(path.join(__dirname, '../public')))

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../public/index.html'))
});

io.on('connect', function(socket) {
  console.log(socket.id)

  socket.on('disconnect', function() {
    world.removeSnake(socket.id)
    delete player[socket.id]
    io.emit('playerLeft', socket.id)
  })

  socket.on('join', function(name) {
    if (player[socket.id])
      return
    world.createSnake(socket.id)
    const newPlayer = new Player(socket.id, name, counter % 5)
    player[socket.id] = newPlayer
    counter++
    io.emit('hasNewPlayer', newPlayer)

    const allPlayers = Object.keys(player).map(id => player[id])
    io.to(socket.id).emit('receivedPlayerInfo', allPlayers)
  })

  socket.on('turn', function(direction) {
    world.turnSnake(socket.id, direction)
  })

  socket.on('respawn', function() {
    world.createSnake(socket.id)
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});