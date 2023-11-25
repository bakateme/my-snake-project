class Snake {
  constructor() {
    this.body = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    this.direction = 'RIGHT';
  }

  get head() {
    return this.body[0];
  }
}

class Food {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.floor(Math.random() * gridSize);
    this.y = Math.floor(Math.random() * gridSize);
  }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
canvas.width = gridSize * 20;
canvas.height = gridSize * 20;

const snake = new Snake();
const food = new Food();

let gameInterval; // Declare gameInterval
let gameRunning = false;
let score = 0;
let speed = 100;
let speedIncreaseInterval;

const startSound = new Audio('startgame.mp3');
const gameOverSound = new Audio('gameover.mp3');
const backgroundMusic = new Audio('backgroundmusic.mp3');
const eatingSound = new Audio('eatingsound.mp3');
eatingSound.volume = 0.8;
backgroundMusic.volume = 0.4;

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const highScoreElement = document.getElementById('highScore');

let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.innerText = highScore;

function playStartSound() {
  startSound.currentTime = 0;
  startSound.play();
}

function playBackgroundMusic() {
  backgroundMusic.loop = true;
  backgroundMusic.play();
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreElement.innerText = highScore;
    highScoreElement.classList.add('high-score-highlight');
  } else {
    highScoreElement.classList.remove('high-score-highlight');
  }
}

function startGame() {
  console.log('Starting game...');
  snake.body = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ];
  snake.direction = 'RIGHT';
  food.reset();
  score = 0;
  updateScore();
  gameRunning = true;

  speedIncreaseInterval = setInterval(() => {
    speed -= 10;
  }, 30000);

  playBackgroundMusic();
}

function moveSnake() {
  const head = { x: snake.head.x, y: snake.head.y };

  switch (snake.direction) {
    case 'UP':
      head.y = (head.y - 1 + gridSize) % gridSize;
      break;
    case 'DOWN':
      head.y = (head.y + 1) % gridSize;
      break;
    case 'LEFT':
      head.x = (head.x - 1 + gridSize) % gridSize;
      break;
    case 'RIGHT':
      head.x = (head.x + 1) % gridSize;
      break;
  }

  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    endGame();
    return;
  }

  for (let i = 1; i < snake.body.length; i++) {
    if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
      endGame();
      return;
    }
  }

  snake.body.pop();
  snake.body.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food.reset();
    growSnake();
    eatingSound.play();
  }
}

function growSnake() {
  const tail = { ...snake.body[snake.body.length - 1] };
  snake.body.push(tail);

 
}

function endGame() {
  gameRunning = false;
  clearInterval(speedIncreaseInterval);
  gameOverSound.play();
  backgroundMusic.pause();
  updateHighScore();
  showRestartButton();
  alert(`Game Over! Your Score: ${score}`);
}

function updateScore() {
  console.log('Updating score...');
  document.getElementById('score').innerText = score;
}

function showRestartButton() {
  restartButton.style.display = 'block';
  startButton.style.display = 'none';
}

function hideRestartButton() {
  restartButton.style.display = 'none';
  startButton.style.display = 'block';
}

function gameLoop() {
  if (gameRunning) {
    moveSnake();
    draw();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#27ae60';
  snake.body.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // Draw food
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

document.getElementById('startButton').addEventListener('click', () => {
  if (!gameRunning) {
    startGame();
    clearInterval(gameInterval); // Clear existing interval
    gameInterval = setInterval(gameLoop, speed); // Assign the interval to a variable
    playStartSound();
  }
});

document.addEventListener('keydown', event => {
  if (gameRunning) {
    switch (event.key) {
      case 'ArrowUp':
        if (snake.direction !== 'DOWN') snake.direction = 'UP';
        break;
      case 'ArrowDown':
        if (snake.direction !== 'UP') snake.direction = 'DOWN';
        break;
      case 'ArrowLeft':
        if (snake.direction !== 'RIGHT') snake.direction = 'LEFT';
        break;
      case 'ArrowRight':
        if (snake.direction !== 'LEFT') snake.direction = 'RIGHT';
        break;
    }
  }
});

document.getElementById('restartButton').addEventListener('click', () => {
  startGame();
  clearInterval(gameInterval); // Clear existing interval
  gameInterval = setInterval(gameLoop, speed); // Assign the interval to a variable
  hideRestartButton();
});
