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

class Level {
  constructor(grid = [], actors = []) {
    this.actors = actors.slice();
    this.status = null;
    this.finishDelay = 1;
    this.grid = grid.slice();
    this.height = this.grid.length;
    this.width = Math.max(0, ...this.grid.map(element=> element.length));
    this.player = this.actors.find(actor => actor.type === 'player');
  }

  isFinished() {
    return this.status !== null && this.finishDelay < 0;
  }

  actorAt(moveActor) {
    if (!(moveActor instanceof Actor)) {
      throw new Error("Level: actorAt's argument is wrong");
    }
    return this.actors.find(actor => actor.isIntersect(moveActor));
  }

  obstacleAt(position, size) {
    if (!((position instanceof Vector)&&(size instanceof Vector))) {
      throw new Error("Передан не вектор.");
    }

    const topBorder = Math.floor(position.y);
    const bottomBorder = Math.ceil(position.y + size.y);
    const leftBorder = Math.floor(position.x);
    const rightBorder = Math.ceil(position.x + size.x);

    if (leftBorder < 0 || rightBorder > this.width || topBorder < 0) {
      return 'wall';
    }
    if (bottomBorder > this.height) {
      return 'lava';
    }

    for (let y = topBorder; y < bottomBorder; y++) {
      for (let x = leftBorder; x < rightBorder; x++) {
        const cell = this.grid[y][x];
        if (cell) {
          return cell;
        }
      }
    }
  }

  removeActor(actor) {
    const findInd = this.actors.indexOf(actor);
    if (findInd !== -1) {
      this.actors.splice(findInd, 1)
    }
  }

  noMoreActors(typeActor) {
    return !this.actors.some(actor => actor.type === typeActor);
  }

  playerTouched(touched, actor) {
    if (this.status !== null) {
      return
    }
    if (['lava', 'fireball'].some(element => element === touched )) {
      this.status = 'lost';
    }
    if (touched === 'coin' && actor.type === 'coin') {
      this.removeActor(actor);
      if (this.noMoreActors('coin')) {
        this.status = 'won';
      }
    }
  }
}


const obstaclesDict = {
  'x': 'wall',
  '!': 'lava'
};

class LevelParser {
  constructor(charsDict = {}) {
    this.actorsLibrary = Object.assign({}, charsDict);
  }

  actorFromSymbol(char) {
    return this.actorsLibrary[char];
  }

  obstacleFromSymbol(char) {
    return obstaclesDict[char];
  }

  createGrid(arrayGrid = []) {
    return arrayGrid.map(line => line.split('').map(char => this.obstacleFromSymbol(char)));
  }

  createActors(arrayActors = []) {
    const actors = [];
    arrayActors.forEach((itemY, y) => {
      itemY.split('').forEach((itemX, x) => {
        const constructorActors = this.actorFromSymbol(itemX);
        if (typeof constructorActors !== 'function') {
          return;
        }
        const result = new constructorActors(new Vector(x, y));
        if (result instanceof Actor) {
          actors.push(result);
        }
      });
    });
    return actors;
  }

  parse(plan) {
    return new Level(this.createGrid(plan), this.createActors(plan));
  }
}
