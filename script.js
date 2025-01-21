const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const rocketImg = new Image();
rocketImg.src = "https://cdn-icons-png.flaticon.com/512/1356/1356479.png";

let gameActive = false;
let x = 0;
let y = canvas.height - 30; // Rocket stays within bounds
let multiplier = 1;
let betAmount = 0;
let potentialWin = 0;
let crashPoint = generateCrashPoint(); // Generate random crash point
let path = [];
let interval;

const startButton = document.getElementById("startButton");
const cashOutButton = document.getElementById("cashOutButton");
const betInput = document.getElementById("betAmount");
const multiplierDisplay = document.getElementById("multiplier");
const potentialWinDisplay = document.getElementById("potentialAmount");
const messageDisplay = document.getElementById("messageDisplay"); // Element for displaying messages

function generateCrashPoint() {
    // Higher chance of crashing before 4x
    const random = Math.random();
    if (random < 0.6) {
        return Math.random() * (4 - 1.5) + 1.5; // 60% chance of crash between 1.5x and 4x
    } else {
        return Math.random() * (10 - 4) + 4; // 40% chance of crash between 4x and 10x
    }
}

function resetGame() {
    gameActive = false;
    x = 0;
    y = canvas.height - 30; // Reset position within bounds
    multiplier = 1;
    potentialWin = 0;
    crashPoint = generateCrashPoint(); // Reset crash point
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
    multiplier += 0.02; // Gradual multiplier increase
    x += 3; // Move horizontally faster
    y -= 1.5; // Move vertically slower

    // Prevent rocket from going out of bounds
    if (x >= canvas.width) x = canvas.width - 15;
    if (y <= 15) y = 15;

    if (multiplier >= crashPoint) {
        messageDisplay.textContent = `Ракета взорвалась на ${multiplier.toFixed(2)}x! Вы проиграли.`;
        messageDisplay.style.color = "red";
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
    messageDisplay.textContent = ""; // Clear message display
    if (betInput.value <= 0) {
        messageDisplay.textContent = "Введите корректную сумму ставки.";
        messageDisplay.style.color = "red";
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
        messageDisplay.textContent = `Вы забрали выигрыш: $${potentialWin}`;
        messageDisplay.style.color = "green";
        resetGame();
    }
}

startButton.addEventListener("click", startGame);
cashOutButton.addEventListener("click", cashOut);
