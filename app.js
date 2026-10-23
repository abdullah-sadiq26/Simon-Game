const colors = ["red", "blue", "green", "yellow"];

let gamePattern = [];
let userPattern = [];
let level = 0;
let started = false;

const strBtn = document.querySelector("#start-btn");
const levelTitle = document.querySelector("#level-title");
const allBtn = document.querySelectorAll(".btn");

// start button logic
strBtn.addEventListener("click", () => {
  if (!started) {
    started = true;
    gamePattern = [];
    level = 0;
    strBtn.style.display = "none";
    nextSequences();
  }
});

// user click button logic
allBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (!started) return;

    let userChosenColor = e.target.id;
    userPattern.push(userChosenColor);
    playSound(userChosenColor);

    correctAnswer(userPattern.length - 1);
  });
});

// check correct answer logig
const correctAnswer = (currentIndex) => {
  if (userPattern[currentIndex] === gamePattern[currentIndex]) {
    if (userPattern.length === gamePattern.length) {
      setTimeout(nextSequences, 1000);
    }
  } else {
    playSound("wrong");
    levelTitle.innerText = "Game Over! Press Restart to Play";
    started = false;
    strBtn.innerText = "Restart";
    strBtn.style.display = "block";
  }
};

// random color generate login
const nextSequences = () => {
  userPattern = [];
  level++;
  levelTitle.innerText = "level " + level;

  let randomNumber = Math.floor(Math.random() * 4);
  let randomColor = colors[randomNumber];
  gamePattern.push(randomColor);

  let blinkDuration = level === 1 ? 1000 : 300;

  let i = 0;
  let interval = setInterval(() => {
    let currentColor = gamePattern[i];
    let button = document.getElementById(currentColor);

    button.style.opacity = "0.3";
    setTimeout(() => {
      button.style.opacity = "1";
    }, blinkDuration);
    playSound(currentColor);

    i++;
    if (i >= gamePattern.length) {
      clearInterval(interval);
    }
  }, blinkDuration + 200);
};

// sound play logic
let audioCtx = null;
const playSound = (name) => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext())();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  let osc = audioCtx.createOscillator();
  let sequencies = { green: 261, red: 329, yellow: 392, blue: 523, wrong: 110 };

  osc.frequency.value = sequencies[name] || 200;
  osc.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
};
