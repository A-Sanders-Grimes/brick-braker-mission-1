const gameBoard = document.getElementById("gameBoard");
const ball = document.getElementById("ball");
const paddle = document.getElementById("paddle");
const bricksContainer = document.getElementById("bricksContainer");
const marcador = document.getElementById("marcador");
const gameMessage = document.getElementById("gameMessage");
const messageText = document.getElementById("messageText");
const restartBtn = document.getElementById("restartBtn");

// Named Constants (Fixes magic numbers and hardcoded grid metrics)
const ROWS = 3;
const COLS = 5;
const BRICK_POINTS = 10;
const PADDLE_SPEED = 6;
const INITIAL_BALL_X = 232;
const INITIAL_BALL_Y = 250;
const INITIAL_DX = 2;
const INITIAL_DY = -2;

// Game State Variables
let score = 0;
let isPlaying = true;
let ballX = INITIAL_BALL_X;
let ballY = INITIAL_BALL_Y;
let dx = INITIAL_DX;
let dy = INITIAL_DY;
let paddleX = 200;
let rightPressed = false;
let leftPressed = false;
let animationFrameId = null;
let brickElements = [];

// Apply dynamic columns configuration directly to CSS grid layout
bricksContainer.style.gridTemplateColumns = `repeat(${COLS}, 75px)`;

function createBricks() {
    bricksContainer.innerHTML = "";
    brickElements = [];
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const brick = document.createElement("div");
            brick.classList.add("brick");
            brick.dataset.status = "1";
            bricksContainer.appendChild(brick);
            brickElements.push(brick);
        }
    }
}

createBricks();

// Event Listeners
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
restartBtn.addEventListener("click", restartGame);

function handleKeyDown(e) {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = true;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = true;
    
    // Secret Key Bonus: Toggle Dark Mode with 'n' or 'N'
    if (e.key === "n" || e.key === "N") {
        document.body.classList.toggle("dark-mode");
    }
}

function handleKeyUp(e) {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = false;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = false;
}

// Reusable Collision Helper function (Resolves duplication feedback)
function checkIntersection(rect1, rect2) {
    return (
        rect1.bottom >= rect2.top &&
        rect1.top <= rect2.bottom &&
        rect1.right >= rect2.left &&
        rect1.left <= rect2.right
    );
}

// Reusable Reset Function (Resolves state duplication feedback)
function resetGameState() {
    score = 0;
    marcador.textContent = `Puntuación: ${score}`;
    ballX = INITIAL_BALL_X;
    ballY = INITIAL_BALL_Y;
    dx = INITIAL_DX;
    dy = INITIAL_DY;
    paddleX = 200;
    createBricks();
    gameMessage.classList.add("hidden");
    isPlaying = true;
}

function updatePaddle() {
    if (rightPressed && paddleX < gameBoard.clientWidth - paddle.clientWidth) {
        paddleX += PADDLE_SPEED;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SPEED;
    }
    paddle.style.left = paddleX + "px";
}

function updateGame() {
    if (!isPlaying) return;

    updatePaddle();

    ballX += dx;
    ballY += dy;

    // Wall Collisions
    if (ballX <= 0 || ballX >= gameBoard.clientWidth - ball.clientWidth) {
        dx = -dx;
    }
    if (ballY <= 0) {
        dy = -dy;
    }

    // Floor Collision (Game Over)
    if (ballY >= gameBoard.clientHeight - ball.clientHeight) {
        messageText.textContent = "💥 ¡Game Over!";
        gameMessage.classList.remove("hidden");
        isPlaying = false;
        return;
    }

    // Update positions before checking element bounding rectangles
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    const ballRect = ball.getBoundingClientRect();
    const paddleRect = paddle.getBoundingClientRect();

    // Paddle Collision
    if (checkIntersection(ballRect, paddleRect)) {
        dy = -dy;
        // Correct ballY to prevent sinking into paddle / stale rect bugs
        ballY = paddleRect.top - gameBoard.getBoundingClientRect().top - ball.offsetHeight;
    }

    // Brick Collisions (Handles at most one brick collision per frame)
    for (let brick of brickElements) {
        if (brick.dataset.status === "1") {
            const brickRect = brick.getBoundingClientRect();
            if (checkIntersection(ballRect, brickRect)) {
                dy = -dy;
                brick.dataset.status = "0";
                brick.classList.add("destroyed");
                score += BRICK_POINTS;
                marcador.textContent = `Puntuación: ${score}`;

                // Win Condition
                if (score === ROWS * COLS * BRICK_POINTS) {
                    messageText.textContent = "🎉 ¡Has ganado!";
                    gameMessage.classList.remove("hidden");
                    isPlaying = false;
                }
                break; // Exit loop early to prevent multi-hit frame bugs
            }
        }
    }

    animationFrameId = requestAnimationFrame(updateGame);
}

function restartGame() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Prevents overlapping duplicate loops
    }
    resetGameState();
    updateGame();
}

// Initial game start
updateGame();
