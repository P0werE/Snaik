"use strict"
const GameSettings = {
  "RES_X": 800,
  "RES_Y": 800,
  "SEG_X": 20,
  "SEG_Y": 20,
  "FPS":   60,
  "Speed": 10,
  "Rel_X": null,
  "Rel_Y": null,
  "Updates": null,
  "colors": {
    EMPTY: [51],
    SNAIK: [0,100,0]

  }

}
GameSettings.Rel_X = (GameSettings.RES_X) / (GameSettings.SEG_X)
GameSettings.Rel_Y = (GameSettings.RES_Y) / (GameSettings.SEG_Y)
GameSettings.Updates =  Math.round(GameSettings.FPS / GameSettings.Speed)

let GAME
let CONTROLLER
let isLooped = false

function setup() {
  createCanvas(GameSettings.RES_X, GameSettings.RES_Y, P2D);
  background(...GameSettings.colors.EMPTY);
  GAME = new Game(GameSettings.SEG_X, GameSettings.SEG_Y)
  frameRate(GameSettings.FPS)

  CONTROLLER = new Human()
  GAME.draw()
  noLoop()
}

let cycles = 0
let gameOver  = false
function draw() {
  cycles++
  if(! gameOver &&  (cycles % GameSettings.Updates) == 0) {
    let gameStatus = GAME.update()
    GAME.draw()

    gameOver = !gameStatus

    if(GAME.gameWon() || gameOver) {
        enrollEnd()
    }

    cycles = 0
  }
}



function enrollEnd() {
    background(51)
    let texttt = GAME.gameWon() ? "YOU WIN" : "YOU LOSE, SUCKER"
    let coloooo = GAME.gameWon() ? [0,255,0]: [255,0,0]
    fill(...coloooo)
    textStyle(BOLD)
    textSize(50)
    let offsetX = GameSettings.RES_X / 4
    let offsetY = GameSettings.RES_Y / 4
    text(texttt, offsetX , offsetY, offsetX*2, offsetY*2)

    fill(150)
    textStyle(NORMAL)
    textSize(25)
    text("Press SPACEBAR for new Game", offsetX , offsetY+150, offsetX*2, offsetY*2)

    isLooped = false
    noLoop()
}



function keyTyped() {
  if(key == " ") {
    if(gameOver) {
      gameOver = false
      background(...GameSettings.colors.EMPTY);
      GAME = new Game(GameSettings.SEG_X, GameSettings.SEG_Y)
      GAME.draw()
    } else if(isLooped) {
      noLoop()
      isLooped = false
      console.log("Game Stopped")
    } else {
      loop()
      isLooped = true
      console.log("Game Continued")
    }
  }

  if(CONTROLLER instanceof Human) {
    if(key == "w") {
      GAME.setDirection(DIRECTION.UP)
    } else  if(key == "a") {
       GAME.setDirection(DIRECTION.LEFT)
    } else  if(key == "s") {
        GAME.setDirection(DIRECTION.DOWN)
    } else  if(key == "d") {
      GAME.setDirection(DIRECTION.RIGHT)
    }
  }
}


function spicy() {
  let mainCanvas = document.querySelector("#main")
  mainCanvas.classList.toggle("spinMyHead")
}

//_____________________________________________________________________________//


//_____________________________________________________________________________//


//_____________________________________________________________________________//

// Controller which are used to interact with the game instance

//_____________________________________________________________________________//

// ENUMs used for the defining the properties of given data structures

const FieldType = {
    "EMPTY": 0,
    "SNAIK": 1,
    "FOOD": 2
}

function fieldEquals(a, b){
  return p5.Vector.sub(a,b).mag() == 0
}

const DIRECTION = {
    "UP": new p5.Vector(0, -1),
    "DOWN": new p5.Vector(0,1),
    "LEFT": new p5.Vector(-1, 0),
    "RIGHT": new p5.Vector(1,0)
}
