
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