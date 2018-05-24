'use strict';

class Vector {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  plus(plusVector) {
    if (!(plusVector instanceof Vector)) {
        throw new Error('Передан не вектор, сложение не выполнено.');
    }
    return new Vector(this.x + plusVector.x, this.y + plusVector.y);
  }

  times(multiplierVector = 1) {
    return new Vector(this.x * multiplierVector, this.y * multiplierVector);
  }
}

class Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if (!((pos instanceof Vector)&&(size instanceof Vector)&&(speed instanceof Vector))) {
      throw new Error('Передан не вектор.');
    }
    this.pos = pos;
    this.size = size;
    this.speed = speed;
  }

  act() {}

  get left() {
    return this.pos.x;
  }

  get top() {
    return this.pos.y;
  }

  get right() {
    return this.pos.x + this.size.x;
  }

  get bottom() {
    return this.pos.y + this.size.y;
  }

  get type() {
    return 'actor';
  }

  isIntersect(moveActor) {
    if (!(moveActor instanceof Actor)) {
      throw new Error('Передан не актер.');
    }
    if (this === moveActor) {
      return false;
    }
    return this.left < moveActor.right && this.top < moveActor.bottom &&
            this.right > moveActor.left && this.bottom > moveActor.top;
  }
}
