const gameBoard = document.getElementById("gameBoard");
const paddle = document.getElementById("paddle");
const bricksContainer = document.getElementById("bricksContainer");

const rows = 3;
const cols = 5;
let totalBricks = rows * cols;
let brickElements = [];

let paddleX = 200;
const paddleSpeed = 6;
let rightPressed = false;
let leftPressed = false;

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

// Event Listeners for Keyboard
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = true;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = false;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = false;
}

// Simple loop to test paddle movement
function update() {
    if (rightPressed && paddleX < gameBoard.clientWidth - paddle.clientWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    paddle.style.left = paddleX + "px";

    requestAnimationFrame(update);
}

update();
