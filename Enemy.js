export default class Enemy {
  constructor(x, y, imageNumber) {
    this.x = x;
    this.y = y;
    this.imageNumber = imageNumber;
    this.width = 44;
    this.height = 32;

    this.image = new Image();
    this.image.src = `icons/saucer${imageNumber}a.ico`;

    this.image2 = new Image();
    this.image2.src = `icons/mysterya.ico`;
  }

  draw(ctx, isMystery) {
    if (isMystery) {
      ctx.drawImage(this.image2, this.x, this.y, this.width, this.height);
    } else {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  move(xVelocity, yVelocity) {
    this.x += xVelocity;
    this.y += yVelocity;
  }

  collideWith(sprite) {
    if (
      this.x + this.width > sprite.x &&
      this.x < sprite.x + sprite.width &&
      this.y + this.height > sprite.y &&
      this.y < sprite.y + sprite.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}
