var SNAKE_COLORS = ['#ba000d', '#9c27b0', '#3f51b5', '#4caf50', '#ffc107']

function drawFood() {
  foods.forEach(f => {
    fill('#d4e157')
    image(SPRITE_FOOD[f.type], f.x, f.y, GRID_SIZE, GRID_SIZE)
  })
}

function drawSnake() {
  Object.keys(snakes).forEach(id => {
    const color = id === socket.id ? '#fff' : (players[id] ? SNAKE_COLORS[players[id].color] : '#ccc')
    fill(color)
    rect(snakes[id].x, snakes[id].y, GRID_SIZE, GRID_SIZE)
    snakes[id].tails.forEach(t => {
      rect(t.x, t.y, GRID_SIZE, GRID_SIZE)
    })
  })
}

function addPlayer(player) {
  $('#scoreBoard').append(`<div class="score bg-${player.color}" data-id="${player.id}">${player.name}: 0</div>`)
}

function removePlayer(id) {
  $('#scoreBoard').find(`[data-id="${id}"]`).remove()
}

function updateScore(id, plusScore) {
  $score = $('#scoreBoard').find(`[data-id="${id}"]`).eq(0)
  players[id].score += plusScore
  $score.html(`${players[id].name}: ${players[id].score}`)
}