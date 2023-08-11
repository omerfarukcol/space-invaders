export default class Player {
  rightPressed = false;
  leftPressed = false;
  shootPressed = false;

  constructor(canvas, velocity, bulletController, isMobile) {
    this.canvas = canvas;
    this.velocity = velocity;
    this.bulletController = bulletController;
    this.isMobile = isMobile;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;
    this.width = 50;
    this.height = 48;
    this.image = new Image();
    this.image.src = "icons/baseshipa.ico";

    this.playerDeathSound = new Audio("sounds/explosion.wav");
    this.playerDeathSound.volume = 0.5;

    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
    this.createMobileControls();

    this.setupKeyboardControls();
  }

  draw(ctx) {
    if (this.shootPressed) {
      this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 40);
    }
    this.move();
    this.collideWithWalls();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collideWithWalls() {
    if (this.x < 0) {
      this.x = 0;
    }

    if (this.x > this.canvas.width - this.width) {
      this.x = this.canvas.width - this.width;
    }
  }

  move() {
    if (this.rightPressed) {
      this.x += this.velocity;
    } else if (this.leftPressed) {
      this.x += -this.velocity;
    }
  }

  keydown = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPressed = true;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = true;
    }
    if (event.code == "Space") {
      this.shootPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPressed = false;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = false;
    }
    if (event.code == "Space") {
      this.shootPressed = false;
    }
  };

  setupKeyboardControls() {
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
  }

  createMobileControls() {
    const leftButton = document.createElement("button");
    leftButton.textContent = "<";
    leftButton.style.backgroundColor = "#C70039";
    leftButton.style.color = "white";
    leftButton.addEventListener("touchstart", () =>
      this.onTouchStart("ArrowLeft")
    );
    leftButton.addEventListener("touchend", () => this.onTouchEnd("ArrowLeft"));

    const rightButton = document.createElement("button");
    rightButton.textContent = ">";
    rightButton.style.backgroundColor = "#C70039";
    rightButton.style.color = "white";
    rightButton.addEventListener("touchstart", () =>
      this.onTouchStart("ArrowRight")
    );
    rightButton.addEventListener("touchend", () =>
      this.onTouchEnd("ArrowRight")
    );

    const fireButton = document.createElement("button");
    fireButton.textContent = "Fire";
    fireButton.style.backgroundColor = "#C70039";
    fireButton.style.color = "white";
    fireButton.addEventListener("touchstart", () => this.onTouchStart("Space"));
    fireButton.addEventListener("touchend", () => this.onTouchEnd("Space"));

    const controlsContainer = document.createElement("div");
    controlsContainer.style.position = "fixed";
    controlsContainer.style.bottom = "20px";
    controlsContainer.style.width = "100%";
    controlsContainer.style.display = "flex";
    controlsContainer.style.justifyContent = "space-between";

    const buttonsContainer = document.createElement("div");
    buttonsContainer.appendChild(leftButton);
    buttonsContainer.appendChild(rightButton);
    controlsContainer.appendChild(buttonsContainer);
    controlsContainer.appendChild(fireButton);

    if (this.isMobile) {
      document.body.appendChild(controlsContainer);
    }
  }

  onTouchStart(code) {
    if (code === "ArrowLeft") {
      this.leftPressed = true;
    } else if (code === "ArrowRight") {
      this.rightPressed = true;
    } else if (code === "Space") {
      this.shootPressed = true;
    }
  }

  onTouchEnd(code) {
    if (code === "ArrowLeft") {
      this.leftPressed = false;
    } else if (code === "ArrowRight") {
      this.rightPressed = false;
    } else if (code === "Space") {
      this.shootPressed = false;
    }
  }
}
