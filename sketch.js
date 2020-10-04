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
    cycles = 0
  }

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

class AbstractWorld {
  constructor(){}
  updateCoords(){}
  getEmpties(){}
  getValue(){}
}

class Field extends AbstractWorld {
  constructor(x,y){
    super()
    this.size = new p5.Vector(x,y)
    this.grid = []
    for(let i = 0; i < x; i++) {
      let temp = []
      for(let j = 0; j < y; j++){
        temp.push(FieldType.EMPTY)
      }
      this.grid.push(temp)
    }
  }

  updateCoords(p5Vector, newValue){
    let x
    let y
    ({x, y} = p5Vector)
    this.grid[x][y] = newValue
  }

  getEmpties(){
    return this.grid.reduce((acc, val, indexx) => {
      val.forEach((element, indexy) => {
        if (element === FieldType.EMPTY) {
          acc.add(new p5.Vector(indexx, indexy))
        }
      })
      return acc
    }, new Set())
  }

  getValue(p5V){
    let x
    let y
    ({x,y} = p5V)
    if(! (x >= 0
       && x < this.size.x
       && y >= 0
       && y < this.size.y)) {
         return undefined
   }

    return this.grid[x][y]
  }

  executeOnEach(func) {
    this.grid.forEach( (e, indexx, list) => {
        e.forEach((element, indexy, list) =>{
        func(element, new p5.Vector(indexx, indexy))
        })
    })
  }

  draw(p5V) {
    let x
    let y
    ({x,y} = p5V)

    fill(...GameSettings.colors.EMPTY)
    noStroke(0)
    rect(
      x * GameSettings.Rel_X,
      y * GameSettings.Rel_Y,
      GameSettings.Rel_X,
      GameSettings.Rel_Y
    )
  }

}

//_____________________________________________________________________________//

class Game {
   constructor(x,y) {

     this.currentTurn = 0
     this.direction = undefined
     this.updateQueue = []

     this.world = new Field(x,y)
     this.snaik = new Snaik()
     this.food = new Food()

     this.spawnSnaik(3)
     this.spawnFood()

   }

   spawnFood(){
     let openSlots = this.world.getEmpties()
     let newPos = Array.from(openSlots)[round(random(openSlots.size-1))]
     console.log("RemainingSlots: ", openSlots.size)
     if(newPos) {
       this.food.setCoordinates(newPos)
       this.updateField(newPos, FieldType.FOOD)
     }
   }

   spawnSnaik(size) {
     let x = round(random((0 + size), (this.world.size.x - size)))
     let y = round(random((0 + size), (this.world.size.y - size)))

     this.snaik.addCoordinates(new p5.Vector(x,y))
     this.updateField(new p5.Vector(x,y), FieldType.SNAIK)

     let restBody = random([...Object.values(DIRECTION)])
     size--
     let temp = new p5.Vector(x,y)
     while (size > 0) {
       let sub = p5.Vector.sub(temp, restBody)
       this.snaik.addCoordinates(sub)
       this.updateField(sub, FieldType.SNAIK)
       temp = sub
       size--
     }

     this.setDirection(this.snaik.getLastDirection())
   }

   setDirection(newDirection){
     let dir = this.snaik.getLastDirection()
     if(p5.Vector.add(dir, newDirection).mag() !== 0) {
         this.direction = newDirection
     }
   }

   addUpdateToQueue(p5V){
     this.updateQueue.push(p5V)
   }
   clearQueue() {
     this.updateQueue = []
   }

   update(){
     this.currentTurn++
     let head = this.snaik.getHead()
     let nextPosition = p5.Vector.add(head, this.direction)

     let typeOfField = this.world.getValue(nextPosition)

     if (typeOfField == undefined || typeOfField == FieldType.SNAIK) {
       return false
     }

    this.snaik.addCoordinates(nextPosition)
    this.updateField(nextPosition, FieldType.SNAIK)

    if(typeOfField != FieldType.FOOD) {
      let last = this.snaik.chopTail()
      this.updateField(last, FieldType.EMPTY)
    } else {
      this.spawnFood()
    }
    return true
   }

   gameWon() {
     return this.world.getEmpties().size == 0
   }

   draw(){
     if(this.currentTurn === 1) {
       this.world.executeOnEach((e, index) => {
         this.world.draw(index)
       })
       this.snaik.draw()
       this.food.draw()
       this.clearQueue()
     } else {
       this.updateQueue.forEach((e) => {
         let field = this.world.getValue(e)
         switch (field) {
           case FieldType.EMPTY:
            this.world.draw(e)
            break;
           case FieldType.SNAIK:
            this.snaik.draw(e)
            break;
           case FieldType.FOOD:
            this.food.draw()
            break;
           default:
            noLoop()
         }
       })
       this.clearQueue()
     }
   }

   updateField(field, newValue) {
     this.world.updateCoords(field, newValue)
     this.addUpdateToQueue(field)
   }


   getSnaik(){return this.snaik}
   getFood(){return this.food}
   getWorld(){return this.world}
   getCurrentRound(){return this.currentTurn}
}

// GAME ENTITIES
class Snaik {
  constructor() {
    this.body = []
  }

  addCoordinates(p5V) {
    this.body.splice(0,0,p5V)
  }

  getLastDirection() {
    let sub = p5.Vector.sub(this.body[0], this.body[1])
    switch (true) {
      case fieldEquals(sub, DIRECTION.UP):
        return DIRECTION.UP
      case fieldEquals(sub, DIRECTION.DOWN):
        return DIRECTION.DOWN
      case fieldEquals(sub, DIRECTION.LEFT):
        return DIRECTION.LEFT
      case fieldEquals(sub, DIRECTION.RIGHT):
        return DIRECTION.RIGHT
      default:
        return undefined
    }
  }

  getHead(){return this.body[0]}
  getBody(){return this.body}
  chopTail(){return this.body.pop()}

  draw(segment){
    if(segment) {
      let indent = 0
      let x
      let y
      ({x,y} = segment)

      fill(...GameSettings.colors.SNAIK)
      noStroke()
      rect(
        x * GameSettings.Rel_X,
        y * GameSettings.Rel_Y,
        GameSettings.Rel_X,
        GameSettings.Rel_Y)




    } else {
      this.body.forEach(e => {
        let x
        let y
        ({x,y} = e)
        fill(...GameSettings.colors.SNAIK)
        noStroke()
        rect(
          x * GameSettings.Rel_X,
          y * GameSettings.Rel_Y,
          GameSettings.Rel_X,
          GameSettings.Rel_Y)
        })
    }
  }

  getLength(){return this.body.length}
}

class Food {
  constructor(){
    this.coords = new p5.Vector()
  }

  setCoordinates(p5V){
    let x
    let y
    ({x,y} = p5V)
    this.coords.x = x
    this.coords.y = y
  }

  getCoordinates(){
    return this.coords
  }

  draw(){
    let x
    let y
    ({x,y} = this.coords)

    textSize(GameSettings.Rel_X - GameSettings.Rel_X / 4)
    strokeWeight(.5)
    textAlign(CENTER)
    text(
      "🐭",
      x * GameSettings.Rel_X + GameSettings.Rel_X / 20,
      y * GameSettings.Rel_Y + GameSettings.Rel_Y / 5,
      GameSettings.Rel_X,
      GameSettings.Rel_Y)
  }
}

//_____________________________________________________________________________//

// Controller which are used to interact with the game instance

class AbstractController {
  constructor(){}
  changeDirection(){}
}

class Human extends AbstractController {
  constructor(){super()}
  changeDirection(func){
    func()
  }
}

class KI extends AbstractController {
  constructor(){}
  changeDirection(){}
}

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
