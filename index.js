//HTML refs
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

//snakePart class
class snakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//game constants
let speed = 7;
let tileCount = 20;
let tileSize = (canvas.width / tileCount) - 2;
let score = 0;

//snake constants
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 1;

let xVelocity = 0;
let yVelocity = 0;

//apple constants
let appleX = 5;
let appleY = 5;

//audio
const gulpSound = new Audio("rip-ears.mp3");

//add event listener
document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    //up
    if (event.keyCode == 38 && (yVelocity != 1)) {
        yVelocity = -1;
        xVelocity = 0;
    }
    //down
    else if (event.keyCode == 40 && (yVelocity != -1)) {
        yVelocity = 1;
        xVelocity = 0;
    }
    //left
    else if (event.keyCode == 37 && (xVelocity != 1)) {
        yVelocity = 0;
        xVelocity = -1;
    }
    //right
    else if (event.keyCode == 39 && (xVelocity != -1)) {
        yVelocity = 0;
        xVelocity = 1;
    }

}

//game loop
function drawGame() {
    updateSnakePosition();
    //check for game over scenarios
    if (gameOver()) {
        return;
    } else {
        clearScreen();
        checkCollision();
        drawApple();
        drawSnake();
        drawScore();
        setTimeout(drawGame, 1000 / speed);
    }
}

function displayGameOverScreen() {
    ctx.fillStyle = "white";
        ctx.font = "50px Verdana";
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "blue");
        gradient.addColorStop("0.5", "red");
        gradient.addColorStop("1.0", "pink");
        ctx.fillStyle = gradient;
        ctx.fillText("You lose!", canvas.width / 4.5, canvas.height / 2);
}

function gameOver() {

    //initial state / vel = 0: start of game
    //upon button press, game starts
    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    if (headX < 0 || headY < 0 || headX >=20 || headY >= 20) {
        displayGameOverScreen();
        return true;
    } 
    
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            displayGameOverScreen();
            return true;
        }
    }

    return false;
}

function clearScreen() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function checkCollision() {
    if ((appleX == headX) && (appleY == headY)) {
        appleX = getRandomInt(20);
        appleY = getRandomInt(20);
        tailLength++;
        score++;
        gulpSound.play();
    }
}

//score methods
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText("Score: " + score, canvas.width - 50, 15);
}

//snake methods

function drawSnake() {
    ctx.fillStyle = 'green';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);

    //draw snake parts
    ctx.fillStyle = 'green';
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * 20, part.y * 20, tileSize, tileSize);
    }
    //put item to the end of the list
    snakeParts.push(new snakePart(headX, headY)); 
    //remove oldest item in the list
    if(snakeParts.length > tailLength) {
        snakeParts.shift();
    }
}

function updateSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

//apple methods
function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

//initialize game loop
drawGame();