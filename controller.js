
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
  