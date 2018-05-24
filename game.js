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
