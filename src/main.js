import * as consts from './constents.js';
import {loadImage, randi} from './utils.js'

var cvs = document.getElementById("game")
var ctx = cvs.getContext("2d")

var npCanvas = document.getElementById("nextpiece")
var npCtx = npCanvas.getContext("2d")

var scoreEle = document.getElementById("score")
var levelEle = document.getElementById("level")
var linesEle = document.getElementById("lines")

var menu = document.getElementsByClassName("menu-container")[0]
var startButton = document.getElementById("startButton")

let blocks = []

async function loadImages() {
  const blue = await loadImage('../assets/sprites/blue.png');
  const red = await loadImage('../assets/sprites/red.png');
  const green = await loadImage('../assets/sprites/green.png');
  const purple = await loadImage('../assets/sprites/purple.png');
  const highBlue = await loadImage('../assets/sprites/highBlue.png');
  const yellow = await loadImage('../assets/sprites/yellow.png');
  const pink = await loadImage('../assets/sprites/pink.png');
  blocks = [blue, red, green, purple, highBlue, yellow, pink]
}

loadImages()

const lineClear = new Audio("assets/sounds/lineClear.wav")
const tetrisClear = new Audio("assets/sounds/tetrisClear.wav")
const place = new Audio("assets/sounds/placePiece.wav")
//const rotateSound = new Audio("assets/rotate.wav")

var level = 0
var lines = 0
var score = 0

var dropScore = 0

var lastTime = 0

var dropSpeedLevels = [48, 42, 38, 33, 28, 23, 18, 13, 8, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1]

var dropConter = 0
var dropSpeed = dropSpeedLevels[level]

var player = {
  x: 4,
  y: 0,
  rot: 0,
  pieceMat: [],
  nextPiece: randi(0, 6)
}

var previewY = player.y

var keyDelay = 8

var down = false
var d = keyDelay - 1

var up = false
var u = keyDelay - 1

var left = false
var l = keyDelay - 1

var right = false
var r = keyDelay - 1

let Effects = []

var start = false

function makeNewPiece() {

  player.pieceMat = consts.pieces[player.nextPiece]
  player.nextPiece = randi(0, 6)

  npCtx.fillStyle = "#000000";
  npCtx.fillRect(0, 0, npCanvas.width, npCanvas.height);
  drawNextPiece();
}

function make2dArray(w, h) {
  var m = []
  for (let i = 0; i < h; i++) {
    m[i] = []
    for (let j = 0; j < w; j++) {
      m[i][j] = 0
    }
  }
  return m
}

var arena = make2dArray(consts.ARENA_WIDTH, consts.ARENA_HEIGHT)

function drawNextPiece() {
  consts.prePieces[player.nextPiece].forEach((row, y) => {
    row.forEach((value, x) => {
      let xOff = 4 - row.length
      let yOff = 2 - consts.prePieces[player.nextPiece].length
      if (value != 0) {
        npCtx.drawImage(blocks[value - 1], (x * consts.GRID) + (xOff * 4), (y * consts.GRID) + (yOff * 4))
      }
    })
  });
}

function drawPiece() {
  player.pieceMat.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value != 0) {
        ctx.drawImage(blocks[value - 1], (x + player.x) * consts.GRID, (y + player.y) * consts.GRID)
      }
    })
  });
}

function drawArena() {
  arena.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value != 0) {
        ctx.drawImage(blocks[value - 1], x * consts.GRID, y * consts.GRID)
      }
    })
  });
}

function collide(mat = player.pieceMat, mx = player.x, my = player.y) {
  const [m, o] = [mat, {
    x: mx,
    y: my
  }]
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
        (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true
      }
    }
  }
  return false
}

function merge() {
  player.pieceMat.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value != 0) {
        arena[y + player.y][x + player.x] = value
      }
    })
  });
}

function shiftArenaDownAt(at) {
  for (let i = at - 1; i > 0; i--) {
    let temp = arena[i];
    arena[i] = arena[i + 1];
    arena[i + 1] = temp;

    // ctx.fillStyle = "#ffffff"
    // ctx.fillRect(0, at * consts.GRID, 80, consts.GRID)
    // ctx.fillRect(0, yPos, 240, consts.GRID * 3)
  }
}

function clearLines() {

  let full = false
  let indexOfRows = []

  for (let i = 0; i < arena.length; i++) {
    for (let j = 0; j < arena[i].length; j++) {

      let num = arena[i][j]
      if (num == 0) {
        full = false
        break
      } else {
        full = true
      }

    }

    if (full) {
      // thers a full line
      arena[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      indexOfRows.push(i)

      Effects.push({
        type: "line",
        time: 50,
        y: i,
      })

      lines++
      linesEle.innerText = lines

      if (lines % 10 == 0) {
        level++
        levelEle.innerText = level

        dropSpeed = dropSpeedLevels[level]

      }

      full = false
    }


  }

  //move every thing down
  if (indexOfRows.length == 0) {
    return;
  }



  for (let i = 0; i < indexOfRows.length; i++) {
    shiftArenaDownAt(indexOfRows[i]);
    if (i == 0) {
      score += 40 * (level + 1)
      lineClear.play()
    } else if (i == 1) {
      score += 100 * (level + 1)
      lineClear.play()
    } else if (i == 2) {
      score += 300 * (level + 1)
      lineClear.play()
    } else if (i == 3) {
      score += 1200 * (level + 1)
      tetrisClear.play()
    }
    scoreEle.innerText = score
  }
  indexOfRows = []

}

function resetGame() {
  arena = make2dArray(consts.ARENA_WIDTH, consts.ARENA_HEIGHT);
  makeNewPiece()
  player.y = 0;

  dropSpeed = dropSpeedLevels[0]

  score = 0
  level = 0
  lines = 0

  scoreEle.innerText = score
  levelEle.innerText = level
  linesEle.innerText = lines

}

function pieceDrop() {

  player.y++
    if (collide()) {
      player.y--;
      merge();
      makeNewPiece();
      clearLines();

      place.play()

      if (down) {
        score += dropScore
        scoreEle.innerText = score
      }

      player.y = 0;
      player.x = 4;
      if (collide()) {
        start = false
        cvs.style.display = "none"
        menu.style.display = "grid"
        //resetGame()
      }
    }
}

function rotateConterClock(mat) {

  for (let i = 0; i < mat.length; i++) {
    mat[i].reverse()
  }

  for (var i = 0; i < mat.length; i++) {
    for (var j = i; j < mat.length; j++) {

      let temp = mat[i][j]
      mat[i][j] = mat[j][i]
      mat[j][i] = temp
    }
  }

}

function rotateClock(array) {
  const numRows = array.length;
  const numCols = array[0].length;

  // Transpose the array
  for (let i = 0; i < numRows; i++) {
    for (let j = i; j < numCols; j++) {
      const temp = array[i][j];
      array[i][j] = array[j][i];
      array[j][i] = temp;
    }
  }

  // Reverse each row or column
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols / 2; j++) {
      const temp = array[i][j];
      array[i][j] = array[i][numCols - j - 1];
      array[i][numCols - j - 1] = temp;
    }
  }

}

function drawEffects() {
  Effects.forEach((effect, i) => {

    if (effect.type == "line") {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, effect.y * consts.GRID, 80, 8)
      setTimeout(() => {
        Effects.splice(i)
      }, effect.time);
    }

		if (effect.type == "drop") {
			cvs.animate([
				{ transform: "translateY(10px)" },
				{ transform: "translateY(0px)" },
			], 
				{ duration: effect.time, iterations: 1, }).onfinish = () => 
			{
				document.querySelector(".side-container").animate([
					{ transform: "translateY(10px)" },
					{ transform: "translateY(0px)" },
				], 
					{ duration: effect.time+10, iterations: 1, })
			}

			setTimeout(() => {
        Effects.splice(i)
      }, effect.time);
		}

  })
}

function updatePreview() {
  previewY = player.y
  for (let y = player.y; y < consts.ARENA_HEIGHT; y++) {
    previewY++
    if (collide(undefined, undefined, previewY)) {
      previewY--
      break
    }
  }
}

function drawPreviewPiece() {
  player.pieceMat.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value != 0) {
        ctx.fillStyle = consts.previewColors[value - 1]
        ctx.fillRect((x + player.x) * consts.GRID, (y + previewY) * consts.GRID, consts.GRID - 1, consts.GRID - 1)
      }
    })
  });
}

function putPieceDown() {
  for (let y = player.y; y < consts.ARENA_HEIGHT; y++) {
    player.y++;
    score++;
      if (collide()) {
				Effects.push({
					type: "drop",
					time: 80,
				})
        score--;
        player.y--
        dropConter = dropSpeed
        break
      }
  }
  scoreEle.innerText = score
}

document.addEventListener('keydown', ({
  keyCode
}) => {
  if (keyCode === 37) {
    left = true
  }
  if (keyCode === 39) {
    right = true
  }
  if (keyCode === 38) {
    rotateClock(player.pieceMat)
    if (collide()) {
      rotateConterClock(player.pieceMat)
    }
  }
  if (keyCode === 40) {
    down = true
  }
})

document.addEventListener("keyup", ({
  keyCode
}) => {
  if (keyCode === 37) {
    left = false
    l = keyDelay - 1
  }
  if (keyCode === 39) {
    right = false
    r = keyDelay - 1
  }
  if (keyCode === 38) {
    up = false
    u = keyDelay - 1
  }
  if (keyCode === 40) {
    down = false
    d = keyDelay - 1
    dropScore = 0
  }

})

document.addEventListener("keypress", ({
  keyCode
}) => {
  if (keyCode == 32) {
    putPieceDown()
  }
})

startButton.onclick = () => {
	StartGame()
}

function StartGame() {
  resetGame()
  cvs.style.display = "block"
  menu.style.display = "none"
  start = true
}

const update = (time = 0) => {
  if (start == false) {
    requestAnimationFrame(update)
    return
  }

  //const deltaTime = time - lastTime
  //const fps = 1 / deltaTime
  lastTime = time
  dropConter += 1

  updatePreview()

  ctx.fillStyle = consts.background
  ctx.fillRect(0, 0, cvs.width, cvs.height)
  drawArena()
  drawPiece()
  drawPreviewPiece()
  drawEffects()

  if (dropConter > dropSpeed) {
    pieceDrop()
    dropConter = 0
  }

  if (left) {
    l++
    if (l % keyDelay == 0) {
      updatePreview()
      player.x--
        if (collide()) {
          player.x++
        }
    }
  }
  if (right) {
    r++
    if (r % keyDelay == 0) {
      updatePreview()
      player.x++
        if (collide()) {
          player.x--
        }
    }
  }
  if (down) {
    d++
    if (d % keyDelay == 0) {
      player.y++
			dropScore++
			if (collide()) {
				player.y--
				dropScore--
			}
    }
  }

  time++
  requestAnimationFrame(update)
}

update()
