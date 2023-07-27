// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;

const playerPaddle = {
  x: 10,
  y: SCREEN_HEIGHT / 2 - 30,
  width: 10,
  height: 60,
  speed: 300,
};
const aiPaddle = {
  x: SCREEN_WIDTH - 20,
  y: SCREEN_HEIGHT / 2 - 30,
  width: 10,
  height: 60,
  speed: 200,
};
const ball = {
  x: SCREEN_WIDTH / 2 - 7.5,
  y: SCREEN_HEIGHT / 2 - 7.5,
  width: 15,
  height: 15,
  speedX: 200,
  speedY: 200,
};

let lastTime;
const deltaTime = 1 / 60;

let score = 0;

function update() {
  if (keys[38]) {
    playerPaddle.y = Math.max(
      playerPaddle.y - playerPaddle.speed * deltaTime,
      0
    );
  }
  if (keys[40]) {
    playerPaddle.y = Math.min(
      playerPaddle.y + playerPaddle.speed * deltaTime,
      SCREEN_HEIGHT - playerPaddle.height
    );
  }

  if (ball.y < aiPaddle.y + aiPaddle.height / 2)
    aiPaddle.y -= aiPaddle.speed * deltaTime;
  if (ball.y > aiPaddle.y + aiPaddle.height / 2)
    aiPaddle.y += aiPaddle.speed * deltaTime;

  ball.x += ball.speedX * deltaTime;
  ball.y += ball.speedY * deltaTime;

  if (
    ball.x < playerPaddle.x + playerPaddle.width &&
    ball.x + ball.width > playerPaddle.x &&
    ball.y < playerPaddle.y + playerPaddle.height &&
    ball.y + ball.height > playerPaddle.y
  ) {
    ball.x = playerPaddle.x + playerPaddle.width;
    ball.speedX *= -1;

    score++;
    updateScore();
  }

  if (
    ball.x < aiPaddle.x + aiPaddle.width &&
    ball.x + ball.width > aiPaddle.x &&
    ball.y < aiPaddle.y + aiPaddle.height &&
    ball.y + ball.height > aiPaddle.y
  ) {
    ball.x = aiPaddle.x - ball.width;
    ball.speedX *= -1;
  }

  if (ball.x < 0 || ball.x > SCREEN_WIDTH) {
    ball.x = SCREEN_WIDTH / 2 - ball.width / 2;
    ball.y = SCREEN_HEIGHT / 2 - ball.height / 2;
    ball.speedX *= -1;
    score = 0;
    updateScore();
  }

  if (ball.y < 0 || ball.y > SCREEN_HEIGHT) {
    ball.speedY *= -1;
  }
}

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = `Score: ${score}`;
}

function render() {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  ctx.fillStyle = "red";
  ctx.fillRect(
    playerPaddle.x,
    playerPaddle.y,
    playerPaddle.width,
    playerPaddle.height
  );
  ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
  ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function startGame() {
  canvas.removeEventListener("click", handleButtonClick);
  gameStarted = true;

  requestAnimationFrame(gameLoop);
}

function handleButtonClick(e) {
  const buttonWidth = 100;
  const buttonHeight = 40;
  const buttonX = SCREEN_WIDTH / 2 - buttonWidth / 2;
  const buttonY = SCREEN_HEIGHT / 2 - buttonHeight / 2;

  const mouseX = e.clientX - canvas.offsetLeft;
  const mouseY = e.clientY - canvas.offsetTop;

  if (
    mouseX >= buttonX &&
    mouseX <= buttonX + buttonWidth &&
    mouseY >= buttonY &&
    mouseY <= buttonY + buttonHeight
  ) {
    canvas.removeEventListener("click", handleButtonClick);
    requestAnimationFrame(gameLoop);
  }
}

function renderStartButton() {
  const buttonWidth = 100;
  const buttonHeight = 40;
  const buttonX = SCREEN_WIDTH / 2 - buttonWidth / 2;
  const buttonY = SCREEN_HEIGHT / 2 - buttonHeight / 2;

  ctx.fillStyle = "blue";
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Start", buttonX + 25, buttonY + 25);
}

function init() {
  ball.speedX = Math.random() < 0.5 ? ball.speedX : -ball.speedX;
  ball.speedY = Math.random() < 0.5 ? ball.speedY : -ball.speedY;

  if (ball.speedX < 0) {
    ball.speedX = -ball.speedX;
  }

  renderStartButton();

  canvas.addEventListener("click", handleButtonClick);
}

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update();
  render();

  if (ball.x >= 0 && ball.x <= SCREEN_WIDTH) {
    requestAnimationFrame(gameLoop);
  } else {
    renderStartButton();
    canvas.addEventListener("click", handleButtonClick);
  }
}

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.keyCode] = true));
window.addEventListener("keyup", (e) => (keys[e.keyCode] = false));

window.addEventListener("load", () => {
  init();
});
