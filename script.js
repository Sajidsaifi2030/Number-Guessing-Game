let secretNumber = generateNumber();
let attempts = 0;
let gameOver = false;
let particles = [];
let fireworksAnimation = null;
let celebrationTimer = null;
let fireworkInterval = null;

const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const checkBtn = document.getElementById("checkBtn");
const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");
const restartBtn = document.getElementById("restartBtn");

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function generateNumber() {
    return Math.floor(Math.random() * 50) + 1;
}

function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

guessForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (gameOver) return;

    const guess = Number(guessInput.value);

    if (
        guessInput.value.trim() === "" ||
        !Number.isInteger(guess) ||
        guess < 1 ||
        guess > 50
    ) {
        message.textContent = "Please enter a number from 1 to 50.";
        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;

    if (guess === secretNumber) {
        message.textContent =
            `🎉 Correct! You won in ${attempts} attempts! 🏆`;

        gameOver = true;
        guessInput.disabled = true;
        checkBtn.disabled = true;

        startCelebration();

    } else if (guess < secretNumber) {
        message.textContent = "📈 Too low! Try a higher number.";
        guessInput.value = "";
        guessInput.focus();

    } else {
        message.textContent = "📉 Too high! Try a lower number.";
        guessInput.value = "";
        guessInput.focus();
    }
});

function startCelebration() {
    stopCelebration();

    document.body.classList.add("celebrating");
    resizeCanvas();
    particles = [];

    // Launch initial fireworks
    for (let i = 0; i < 7; i++) {
        createFirework(
            Math.random() * window.innerWidth,
            60 + Math.random() * window.innerHeight * 0.55
        );
    }

    animateFireworks();

    // Keep launching fireworks
    fireworkInterval = setInterval(() => {
        createFirework(
            40 + Math.random() * (window.innerWidth - 80),
            50 + Math.random() * window.innerHeight * 0.5
        );
    }, 450);

    // End celebration after 6 seconds
    celebrationTimer = setTimeout(() => {
        stopCelebration();
    }, 6000);
}

function createFirework(x, y) {
    const colors = [
        "#ff1744",
        "#ffea00",
        "#00e5ff",
        "#76ff03",
        "#ff9100",
        "#e040fb",
        "#ffffff"
    ];

    const color = colors[
        Math.floor(Math.random() * colors.length)
    ];

    const count = 65;

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 4 + 1.5;

        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 65 + Math.random() * 25,
            maxLife: 90,
            color: color,
            size: Math.random() * 2.5 + 1
        });
    }
}

function animateFireworks() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vx *= 0.985;
        particle.vy *= 0.985;
        particle.vy += 0.035;

        particle.life--;

        ctx.globalAlpha = Math.max(
            0,
            particle.life / particle.maxLife
        );

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    ctx.globalAlpha = 1;

    particles = particles.filter(particle => particle.life > 0);

    if (document.body.classList.contains("celebrating")) {
        fireworksAnimation = requestAnimationFrame(animateFireworks);
    }
}

function stopCelebration() {
    document.body.classList.remove("celebrating");

    clearTimeout(celebrationTimer);
    clearInterval(fireworkInterval);

    if (fireworksAnimation !== null) {
        cancelAnimationFrame(fireworksAnimation);
        fireworksAnimation = null;
    }

    particles = [];
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

restartBtn.addEventListener("click", function () {
    stopCelebration();

    secretNumber = generateNumber();
    attempts = 0;
    gameOver = false;

    attemptsDisplay.textContent = "0";
    message.textContent = "Let's start guessing!";

    guessInput.value = "";
    guessInput.disabled = false;
    checkBtn.disabled = false;

    guessInput.focus();
});