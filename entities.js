
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
  

    drawHull(x,y) {
        let r,g,b
        [r , g, b] = GameSettings.colors.SNAIK

        let brightnesss = -10
        x = x * GameSettings.Rel_X
        y = y * GameSettings.Rel_Y
        fill(r + brightnesss, g+ brightnesss,b+ brightnesss)
        noStroke()
        rect( x,
            y,
            GameSettings.Rel_X ,
            GameSettings.Rel_Y)
    }

    drawBody(x,y) {
            let r,g,b
            [r , g, b] = GameSettings.colors.SNAIK
             x = x * GameSettings.Rel_X
             y = y * GameSettings.Rel_Y

            let insetX0 = 2
            let insetX1 = -4
            let insetY0 = 2
            let insetY1  = -4 
            // stretch the inner rectangle to overshoot the border to connect segments
            
            let dir = this.getLastDirection() 
            switch (dir) {
                case DIRECTION.UP:
                    insetY1 = 2
                    insetY0 = 2
                    break
                case DIRECTION.RIGHT:
                    insetX0 = -2
                    insetX1 = 2
                    break
                case DIRECTION.LEFT:
                    insetX1 = 2
                    break
                case DIRECTION.DOWN:
                    insetY0 = -2
                    insetY1 = 2
                    break
                default:
                    break
            }

            fill(r, g,b)
            noStroke()
            rect(
                x + insetX0,
                y + insetY0,
                GameSettings.Rel_X + insetX1,
                GameSettings.Rel_Y + insetY1)
    }

    draw(segment){
        if(segment) {
            let indent = 0
            let x
            let y
            ({x,y} = segment)
            this.drawHull(x,y)
            this.drawBody(x,y)
      
          } else {
            this.body.forEach(e => {
                let x
                let y
                ({x,y} = e)  
                this.drawHull(x,y)
            })

            this.body.forEach(e => {
                let x
                let y
                ({x,y} = e)  
                this.drawBody(x,y)
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
  