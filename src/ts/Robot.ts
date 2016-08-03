module Robot {
  'use strict'

  enum Direction { up, down, left, right}

  class Robot {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(direction: Direction = Direction.up) {

    }
  }

}
