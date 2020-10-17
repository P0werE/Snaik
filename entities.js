
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
        let draww = (xx, yy) => {
            let r,g,b
            [r , g, b] = GameSettings.colors.SNAIK

            let brightnesss = -10
            fill(r + brightnesss, g+ brightnesss,b+ brightnesss)

            let x = xx * GameSettings.Rel_X
            let y = yy * GameSettings.Rel_Y

            let inset = 4

            noStroke()
            rect(
                x + inset,
                y + inset,
                GameSettings.Rel_X - inset,
                GameSettings.Rel_Y - inset)
            
                fill(r,g,b)
                inset = 0
                noStroke()
                rect( x + inset,
                    y + inset,
                    GameSettings.Rel_X - inset,
                    GameSettings.Rel_Y - inset)




        }

      if(segment) {
        let indent = 0
        let x
        let y
        ({x,y} = segment)
        draww(x,y)
  
      } else {
        this.body.forEach(e => {
            let x
            let y
            ({x,y} = e)
            draww(x,y)
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
  