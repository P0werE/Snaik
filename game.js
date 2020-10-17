
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