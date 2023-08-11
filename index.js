import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.height = 600;
canvas.width = 600;

const background = new Image();
background.src = "images/space.png";

let isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

let playerBulletController = new BulletController(canvas, 4, "red", true);
let enemyBulletController = new BulletController(canvas, 40, "white", false);
let enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController,
  false
);

let mysteryController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController,
  true
);
let player = new Player(canvas, 3, playerBulletController, isMobile);

let isGameOver = false;
let didWin = false;
let isGameRunning = false;
let isGamePaused = false;

let moveCount = 0;
let delayCountdown = 50;
let delay = 50;
let showMystery = false;

document.addEventListener("DOMContentLoaded", () => {
  const welcomePage = document.getElementById("welcomePage");
  const gamePage = document.getElementById("gamePage");
  const pauseButton = document.getElementById("pauseButton");
  const pauseMenu = document.getElementById("pauseMenu");
  const continueButton = document.getElementById("continueButton");
  const homeButton = document.getElementById("homeButton");
  const gameOverMenu = document.getElementById("gameOverMenu");
  const exitButton = document.getElementById("exitButton");
  const restartButton = document.getElementById("restartButton");
  const level1Button = document.getElementById("level1Button");
  const level2Button = document.getElementById("level2Button");
  const level3Button = document.getElementById("level3Button");
  const points = document.getElementById("points");

  level1Button.addEventListener("click", () => {
    enemyController.selectedLevel = 1;
    mysteryController.selectedLevel = 1;
    welcomePage.style.display = "none";
    gamePage.style.display = "block";
    isGameRunning = true;
    game();
  });

  level2Button.addEventListener("click", () => {
    enemyController.selectedLevel = 2;
    mysteryController.selectedLevel = 2;
    welcomePage.style.display = "none";
    gamePage.style.display = "block";
    isGameRunning = true;
    game();
  });

  level3Button.addEventListener("click", () => {
    enemyController.selectedLevel = 3;
    mysteryController.selectedLevel = 3;
    welcomePage.style.display = "none";
    gamePage.style.display = "block";
    isGameRunning = true;
    game();
  });

  points.innerHTML = 0;

  restartButton.addEventListener("click", () => {
    playerBulletController = new BulletController(canvas, 4, "red", true);
    enemyBulletController = new BulletController(canvas, 4, "white", false);
    enemyController = new EnemyController(
      canvas,
      enemyBulletController,
      playerBulletController,
      false
    );

    mysteryController = new EnemyController(
      canvas,
      enemyBulletController,
      playerBulletController,
      true
    );

    player = new Player(canvas, 3, playerBulletController, isMobile);
    isGameOver = false;
    didWin = false;
    isGameRunning = true;
    isGamePaused = false;
    showMystery = false;

    setTimeout(() => {
      showMystery = true;
    }, 25000);

    moveCount = 0;
    delayCountdown = 50;
    delay = 50;
    gameOverMenu.style.display = "none";
    pauseButton.style.display = "block";
    points.style.display = "block";
    game();
  });

  pauseButton.addEventListener("click", () => {
    points.style.display = "none";
    if (isGameRunning) {
      isGamePaused = true;
      pauseMenu.style.display = "block";
      pauseButton.style.display = "none";
    }
  });

  exitButton.addEventListener("click", () => {
    location.reload(true);
  });

  continueButton.addEventListener("click", () => {
    points.style.display = "block";
    if (isGameRunning) {
      isGamePaused = false;
      pauseMenu.style.display = "none";
      pauseButton.style.display = "block";
    }
  });

  homeButton.addEventListener("click", () => {
    location.reload(true);
  });
});

setTimeout(() => {
  showMystery = true;
}, 2500);

function game() {
  checkGameOver();
  points.innerHTML =
    enemyController.deadEnemyCount * 50 +
    mysteryController.deadEnemyCount * 500;
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver();
  if (isGameRunning && !isGamePaused && !isGameOver) {
    delayCountdown--;

    if (showMystery == true) {
      mysteryController.draw(ctx, delayCountdown);
    }
    enemyController.draw(ctx, delayCountdown);

    player.draw(ctx);

    if (delayCountdown < 0) {
      delayCountdown = delay;
      moveCount++;
    }
    if (moveCount == 10 && delay > 25) {
      delay -= 3;
      moveCount = 0;
    }
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
  }
}

var hasPlayedDeathSound = false;

function displayGameOver() {
  if (isGameOver) {
    if (!didWin && !hasPlayedDeathSound) {
      player.playerDeathSound.play();
      hasPlayedDeathSound = true;
    }
    let text = didWin ? "You Win" : "Game Over";
    let textOffset = didWin ? 3.5 : 5;
    points.style.display = "none";
    gameOverMenu.style.display = "block";
    pauseMenu.style.display = "none";
    pauseButton.style.display = "none";
    ctx.fillStyle = "white";
    ctx.font = "70px Arial";
    ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
  }
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }

  if (enemyBulletController.collideWith(player)) {
    isGameOver = true;
  }

  if (
    enemyController.collideWith(player) ||
    mysteryController.collideWith(player)
  ) {
    isGameOver = true;
  }

  if (
    enemyController.enemyRows.length === 0 &&
    mysteryController.enemyRows.length === 0
  ) {
    didWin = true;
    isGameOver = true;
  }
}

function animate() {
  game();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
