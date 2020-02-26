var socket = io()

socket.on('heartbeat', data => {
  snakes = data.snakes
  foods = data.foods
})

socket.on('dead', id => {
  if (id === socket.id) {
    isGameover = true
  }
})

socket.on('hasNewPlayer', player => {
  if (player.id !== socket.id) {
    players[player.id] = player
    addPlayer(player)
  }
})

socket.on('receivedPlayerInfo', allPlayers => {
  allPlayers.forEach(p => {
    players[p.id] = p
    addPlayer(p)
  })
})

socket.on('playerLeft', id => {
  delete players[id]
  removePlayer(id)
})

socket.on('takeScore', data => {
  updateScore(data.id, data.score)
})