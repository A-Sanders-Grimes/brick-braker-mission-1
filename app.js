const gameBoard = document.getElementById("gameBoard");
const bricksContainer = document.getElementById("bricksContainer");

const rows = 3;
const cols = 5;
let totalBricks = rows * cols;
let brickElements = [];

// DOM Manipulation: Dynamically create brick nodes
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
console.log("Fase 2 completada: Ladrillos generados en el DOM.");