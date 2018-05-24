'use strict';

class Vector {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }


  plus(plusVector) {
    if (!(plusVector)) {
      throw new Error('Передан не вектор, сложение не выполнено.');
    }
    return new Vector(this.x + plusVector.x, this.y + plusVector.y);
  }

  times(multiplierVector = 1) {
    return new Vector(this.x * multiplierVector, this.y * multiplierVector);
  }
}

const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
