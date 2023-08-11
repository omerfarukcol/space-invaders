import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

export default class EnemyController {
  currentDirection = MovingDirection.right;
  xVelocity = 0;
  yVelocity = 0;

  moveDownTimerDefault = 50;
  moveDownTimer = this.moveDownTimerDefault;

  fireBulletTimer = Math.floor(Math.random() * 100) + 80;

  constructor(
    canvas,
    enemyBulletController,
    playerBulletController,
    isMystery
  ) {
    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;
    this.playerBulletController = playerBulletController;
    this.deadEnemyCount = 0;
    this.isMystery = isMystery;
    this.selectedLevel;
    this.enemyDeathSound = new Audio("sounds/invaderkilled.wav");
    this.enemyDeathSound.volume = 0.1;

    this.enemyMoveSound1 = new Audio("sounds/fastinvader1.wav");
    this.enemyMoveSound1.volume = 0.3;

    this.enemyMoveSound2 = new Audio("sounds/fastinvader2.wav");
    this.enemyMoveSound2.volume = 0.3;

    this.enemyMoveSound3 = new Audio("sounds/fastinvader3.wav");
    this.enemyMoveSound3.volume = 0.3;

    this.enemyMoveSound4 = new Audio("sounds/fastinvader4.wav");
    this.enemyMoveSound4.volume = 0.3;

    this.soundNumber = 1;
    this.enemyMap;

    this.enemyRows = [];

    if (!isMystery) {
      this.enemyMap = [
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ];
    } else {
      this.enemyMap = [[3]];
    }

    this.defaultXVelocity;
    this.defaultYVelocity;

    if (!isMystery) {
      this.defaultXVelocity = 10;
      this.defaultYVelocity = 20;
    } else {
      this.defaultXVelocity = 1;
      this.defaultYVelocity = 0;
    }

    this.createEnemies();
  }

  draw(ctx, delay) {
    this.decrementMoveDownTimer();
    this.updateVelocityAndDirection();
    this.collisionDetection();
    this.drawEnemies(ctx, delay);
    this.resetMoveDownTimer();
    this.fireBullet();
  }

  collisionDetection() {
    this.enemyRows.forEach((enemyRow) => {
      enemyRow.forEach((enemy, enemyIndex) => {
        if (this.playerBulletController.collideWith(enemy)) {
          this.enemyDeathSound.currentTime = 0;
          this.deadEnemyCount++;
          this.enemyDeathSound.play();
          enemyRow.splice(enemyIndex, 1);
        }
      });
    });

    this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
  }

  fireBullet() {
    this.fireBulletTimer--;
    if (this.fireBulletTimer <= 0 && this.enemyRows.length > 0) {
      const enemy3type = this.enemyRows[0].flat();
      const enemyIndex = Math.floor(Math.random() * enemy3type.length);
      const enemy = enemy3type[enemyIndex];
      this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
      if (this.selectedLevel == 3) {
        this.fireBulletTimer = Math.floor(Math.random() * 80);
      } else {
        this.fireBulletTimer = Math.floor(Math.random() * 100) + 80;
      }
      if (this.selectedLevel == 2 || this.selectedLevel == 3) {
        setTimeout(() => {
          this.enemyBulletController.shoot(
            enemy.x + enemy.width / 2,
            enemy.y,
            -3
          );
        }, 150);
      }
    }
  }

  resetMoveDownTimer() {
    if (this.moveDownTimer <= 0) {
      this.moveDownTimer = this.moveDownTimerDefault;
    }
  }

  decrementMoveDownTimer() {
    if (
      this.currentDirection === MovingDirection.downLeft ||
      this.currentDirection === MovingDirection.downRight
    ) {
      this.moveDownTimer--;
    }
  }

  updateVelocityAndDirection() {
    for (const enemyRow of this.enemyRows) {
      if (this.currentDirection == MovingDirection.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;
        const rightMostEnemy = enemyRow[enemyRow.length - 1];
        if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
          this.currentDirection = MovingDirection.downLeft;
          break;
        }
      } else if (this.currentDirection === MovingDirection.downLeft) {
        if (this.moveDown(MovingDirection.left)) {
          break;
        }
      } else if (this.currentDirection === MovingDirection.left) {
        this.xVelocity = -this.defaultXVelocity;
        this.yVelocity = 0;
        const leftMostEnemy = enemyRow[0];
        if (leftMostEnemy.x <= 0) {
          if (this.isMystery) {
            this.enemyRows = [];
            break;
          }
          this.currentDirection = MovingDirection.downRight;
          break;
        }
      } else if (this.currentDirection === MovingDirection.downRight) {
        if (this.moveDown(MovingDirection.right)) {
          break;
        }
      }
    }
  }

  moveDown(newDirection) {
    this.xVelocity = 0;
    this.yVelocity = this.defaultYVelocity;
    if (this.moveDownTimer <= 0) {
      this.currentDirection = newDirection;
      return true;
    }
    return false;
  }

  drawEnemies(ctx, delay) {
    if (delay == 0 && !this.isMystery) {
      if (this.soundNumber == 1) {
        this.enemyMoveSound1.currentTime = 0;
        this.enemyMoveSound1.play();
      } else if (this.soundNumber == 2) {
        this.enemyMoveSound2.currentTime = 0;
        this.enemyMoveSound2.play();
      } else if (this.soundNumber == 3) {
        this.enemyMoveSound3.currentTime = 0;
        this.enemyMoveSound3.play();
      } else if (this.soundNumber == 4) {
        this.enemyMoveSound4.currentTime = 0;
        this.enemyMoveSound4.play();
      }
      this.soundNumber = this.soundNumber + 1;
      if (this.soundNumber >= 5) {
        this.soundNumber = 1;
      }
    }
    this.enemyRows.flat().forEach((enemy) => {
      if (delay === 0 && !this.isMystery) {
        enemy.move(this.xVelocity, this.yVelocity);
      } else if (this.isMystery) {
        enemy.move(this.xVelocity, this.yVelocity);
      }
      enemy.draw(ctx, this.isMystery);
    });
  }

  happy = () => {};

  createEnemies() {
    this.enemyMap.forEach((row, rowIndex) => {
      this.enemyRows[rowIndex] = [];
      row.forEach((enemyNumber, enemyIndex) => {
        if (enemyNumber > 0) {
          this.enemyRows[rowIndex].push(
            new Enemy(enemyIndex * 50, rowIndex * 35, enemyNumber)
          );
        }
      });
    });
  }

  collideWith(sprite) {
    return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
  }
}
