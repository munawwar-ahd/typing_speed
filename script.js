// ======================
// PARAGRAPH POOLS
// ======================
const texts = {
  easy: [
    "Typing is a simple skill that improves with daily practice. Stay relaxed and focus on accuracy while your speed improves naturally.",
    "Learning to type helps you work faster and smarter. Simple words and calm focus build confidence over time.",
    "Practice helps your fingers remember positions on the keyboard. Accuracy is more important than speed at first."
  ],

  medium: [
    "Typing speed tests improve rhythm, accuracy, and confidence. Consistent practice builds muscle memory and reduces hesitation over time.",
    "Web developers rely heavily on typing efficiency. Writing clean code requires focus, patience, and attention to detail.",
    "User experience depends on responsiveness and clarity. Accurate typing improves productivity in modern digital workflows."
  ],

  hard: [
    "High performance systems require deliberate design choices and disciplined execution. Typing complex text under pressure tests focus and endurance.",
    "Advanced software development involves managing complexity, understanding trade-offs, and maintaining clarity under time constraints.",
    "Long form technical writing demands sustained concentration, precision, and consistency to maintain professional quality."
  ]
};

// ======================
// DOM ELEMENTS
// ======================
const textDisplay = document.getElementById("text-display");
const input = document.getElementById("input");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("accuracy");
const timeEl = document.getElementById("time");
const restartBtn = document.getElementById("restart-btn");
const result = document.getElementById("result");
const timeMode = document.getElementById("time-mode");
const difficulty = document.getElementById("difficulty");
const themeToggle = document.getElementById("theme-toggle");

// ======================
// AUDIO
// ======================
const keySound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1386.mp3");
const errorSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3");
const finishSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3");

// ======================
// STATE
// ======================
let fullText = "";
let startTime = null;
let timer = null;
let timeLeft = 30;
let totalTyped = 0;
let totalCorrect = 0;

// ======================
// UTIL
// ======================
function randomParagraph(level) {
  const pool = texts[level];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ======================
// INIT
// ======================
function init() {
  fullText = randomParagraph(difficulty.value);
  renderText();

  input.value = "";
  input.disabled = false;
  input.focus();

  startTime = null;
  totalTyped = 0;
  totalCorrect = 0;

  clearInterval(timer);
  timeLeft = parseInt(timeMode.value);
  timeEl.innerText = timeLeft;

  wpmEl.innerText = 0;
  accEl.innerText = 100;
  result.classList.add("hidden");
}

// ======================
// RENDER TEXT
// ======================
function renderText() {
  textDisplay.innerHTML = "";
  fullText.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.innerText = char;
    if (i === input.value.length) span.classList.add("current");
    textDisplay.appendChild(span);
  });
}

// ======================
// TIMER
// ======================
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft;
    if (timeLeft <= 0) endTest();
  }, 1000);
}

// ======================
// INPUT HANDLER
// ======================
input.addEventListener("input", () => {
  if (!startTime) {
    startTime = Date.now();
    startTimer();
  }

  keySound.currentTime = 0;
  keySound.play();

  const typed = input.value;
  const chars = textDisplay.querySelectorAll("span");

  const index = typed.length - 1;
  totalTyped++;

  chars.forEach((char, i) => {
    char.classList.remove("correct", "incorrect", "current");

    if (typed[i] == null) {
      if (i === typed.length) char.classList.add("current");
    } else if (typed[i] === char.innerText) {
      char.classList.add("correct");
    } else {
      char.classList.add("incorrect");
      errorSound.currentTime = 0;
      errorSound.play();
    }
  });

  if (typed[index] === fullText[index]) {
    totalCorrect++;
  }

  const accuracy = Math.floor((totalCorrect / totalTyped) * 100);
  accEl.innerText = accuracy || 100;

  const minutes = (Date.now() - startTime) / 60000;
  const wpm = Math.floor((typed.length / 5) / minutes) || 0;
  wpmEl.innerText = wpm;

  if (typed.length / fullText.length > 0.8) {
    fullText += " " + randomParagraph(difficulty.value);
    renderText();
  }
});

// ======================
// END TEST
// ======================
function endTest() {
  clearInterval(timer);
  input.disabled = true;
  finishSound.play();

  result.innerHTML = `
    <p>🔥 Time's Up!</p>
    <p>Speed: <strong>${wpmEl.innerText} WPM</strong></p>
    <p>Accuracy: <strong>${accEl.innerText}%</strong></p>
  `;
  result.classList.remove("hidden");
}

// ======================
// PREVENT PASTE
// ======================
input.addEventListener("paste", e => e.preventDefault());

// ======================
// THEME TOGGLE
// ======================
function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
}

themeToggle.addEventListener("click", () => {
  const current = document.body.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

setTheme(localStorage.getItem("theme") || "dark");

// ======================
// EVENTS
// ======================
restartBtn.addEventListener("click", init);
timeMode.addEventListener("change", init);
difficulty.addEventListener("change", init);

// ======================
init();
