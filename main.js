//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

//cactus
let cactusArray = [];

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

//physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d"); //used for drawing on the board

  //draw initial dinosaur
  context.fillStyle = "red";
  context.fillRect(dino.x, dino.y, dino.width, dino.height);

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000);
  document.addEventListener("keydown", moveDino);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText("Game Over", boardWidth / 2 - 70, boardHeight / 2);
    document.getElementById("tryAgainButton").style.display = "block";
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  //dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
  context.fillStyle = "red";
  context.fillRect(dino.x, dino.y, dino.width, dino.height);

  //cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.fillStyle = "green";
    context.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);

    if (detectCollision(dino, cactus)) {
      gameOver = true;
    }
  }

  //score
  context.fillStyle = "black";
  context.font = "20px courier";
  score++;
  context.fillText("Score: " + score, 5, 20);
}

function moveDino(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    //jump
    velocityY = -10;
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  //place cactus
  let cactus = {
    x: cactusX,
    y: cactusY,
    width: getRandomCactusWidth(),
    height: cactusHeight,
  };

  cactusArray.push(cactus);

  if (cactusArray.length > 5) {
    cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
  }
}

function getRandomCactusWidth() {
  let random = Math.random();
  if (random < 0.5) {
    return 34;
  } else if (random < 0.75) {
    return 69;
  } else {
    return 102;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function restart() {
  location.reload();
}
