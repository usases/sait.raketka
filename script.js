const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const rocketImg = new Image();
rocketImg.src = "https://cdn-icons-png.flaticon.com/512/1356/1356479.png";

let gameActive = false;
let x = 0;
let y = canvas.height;
let multiplier = 1;
let betAmount = 0;
let potentialWin = 0;
let path = [];
let interval;

const startButton = document.getElementById("startButton");
const cashOutButton = document.getElementById("cashOutButton");
const betInput = document.getElementById("betAmount");
const multiplierDisplay = document.getElementById("multiplier");
const potentialWinDisplay = document.getElementById("potentialAmount");

function resetGame() {
    gameActive = false;
    x = 0;
    y = canvas.height;
    multiplier = 1;
    potentialWin = 0;
    path = [];
    clearInterval(interval);
    cashOutButton.disabled = true;
    startButton.disabled = false;
    multiplierDisplay.textContent = "1.00x";
    potentialWinDisplay.textContent = "0";
}

function drawRocket() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw path
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.moveTo(0, canvas.height);
    path.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();

    // Draw rocket
    ctx.drawImage(rocketImg, x - 15, y - 15, 30, 30);
}

function updateRocketPosition() {
    multiplier += 0.01; // Gradual multiplier increase
    x += 2; // Move horizontally
    y -= 1.2; // Move vertically

    if (x >= canvas.width || y <= 0) {
        alert("Ракета взорвалась! Вы проиграли.");
        resetGame();
        return;
    }

    // Update potential win
    potentialWin = (betAmount * multiplier).toFixed(2);
    multiplierDisplay.textContent = multiplier.toFixed(2) + "x";
    potentialWinDisplay.textContent = potentialWin;

    path.push({ x, y });
    drawRocket();
}

function startGame() {
    if (betInput.value <= 0) {
        alert("Введите корректную сумму ставки.");
        return;
    }

    betAmount = parseFloat(betInput.value);
    resetGame();
    gameActive = true;

    startButton.disabled = true;
    cashOutButton.disabled = false;

    interval = setInterval(updateRocketPosition, 50);
}

function cashOut() {
    if (gameActive) {
        alert(`Вы забрали выигрыш: $${potentialWin}`);
        resetGame();
    }
}

startButton.addEventListener("click", startGame);
cashOutButton.addEventListener("click", cashOut);
