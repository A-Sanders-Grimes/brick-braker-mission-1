const gameBoard = document.getElementById("gameBoard");
const ball = document.getElementById("ball");
const paddle = document.getElementById("paddle");
const bricksContainer = document.getElementById("bricksContainer");
const marcador = document.getElementById("marcador");
const gameMessage = document.getElementById("gameMessage");
const messageText = document.getElementById("messageText");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let isPlaying = true;
let ballX = 232;
let ballY = 250;
let dx = 3;
let dy = -3;
let paddleX = 200;
const paddleSpeed = 6;
let rightPressed = false;
let leftPressed = false;

const rows = 3;
const cols = 5;
let totalBricks = rows * cols;
let brickElements = [];

function createBricks() {
    bricksContainer.innerHTML = "";
    brickElements = [];
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const brick = document.createElement("div");
            brick.classList.add("brick");
            brick.dataset.row = r;
            brick.dataset.col = c;
            brick.dataset.status = "1";
            bricksContainer.appendChild(brick);
            brickElements.push(brick);
        }
    }
}

createBricks();

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
restartBtn.addEventListener("click", restartGame);

function keyDownHandler(e) {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = true;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = false;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = false;
}

function update() {
    if (!isPlaying) return;

    if (rightPressed && paddleX < gameBoard.clientWidth - paddle.clientWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    paddle.style.left = paddleX + "px";

    ballX += dx;
    ballY += dy;

    if (ballX <= 0 || ballX >= gameBoard.clientWidth - ball.clientWidth) {
        dx = -dx;
    }
    if (ballY <= 0) {
        dy = -dy;
    }

    const paddleRect = paddle.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    if (
        ballRect.bottom >= paddleRect.top &&
        ballRect.top <= paddleRect.bottom &&
        ballRect.right >= paddleRect.left &&
        ballRect.left <= paddleRect.right
    ) {
        dy = -dy;
        ballY = paddleRect.top - gameBoard.getBoundingClientRect().top - ball.offsetHeight;
    }

    if (ballY >= gameBoard.clientHeight - ball.clientHeight) {
        messageText.textContent = "💥 ¡Game Over!";
        gameMessage.classList.remove("hidden");
        isPlaying = false;
        return;
    }

    brickElements.forEach(brick => {
        if (brick.dataset.status === "1") {
            const brickRect = brick.getBoundingClientRect();

            if (
                ballRect.bottom >= brickRect.top &&
                ballRect.top <= brickRect.bottom &&
                ballRect.right >= brickRect.left &&
                ballRect.left <= brickRect.right
            ) {
                dy = -dy;
                brick.dataset.status = "0";
                brick.classList.add("destroyed");
                score += 10;
                marcador.textContent = `Puntuación: ${score}`;

                if (score === totalBricks * 10) {
                    messageText.textContent = "🎉 ¡Has ganado!";
                    gameMessage.classList.remove("hidden");
                    isPlaying = false;
                }
            }
        }
    });

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    requestAnimationFrame(update);
}

function restartGame() {
    ballX = 232;
    ballY = 250;
    dx = 3;
    dy = -3;
    score = 0;
    marcador.textContent = `Puntuación: ${score}`;
    paddleX = 200;
    createBricks();
    gameMessage.classList.add("hidden");
    isPlaying = true;
    update();
}

update();
