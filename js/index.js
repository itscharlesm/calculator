const result = document.getElementById('result');

function append(value) {
    result.value += value;
}

function clearAll() {
    // Clear calculator display
    result.value = '';

    // Stop and clear message
    const container = document.getElementById('messageContainer');
    if (container) {
        container.innerHTML = '';
    }

    // Stop ANY playing audio
    document.querySelectorAll('audio').forEach(audio => {
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });

    // Turn OFF power
    powerOn = false;
    powerBtn.classList.remove('on');
    powerBtn.textContent = '🔴';
}

function clearOne() {
    result.value = result.value.slice(0, -1);

    // Show message if power is ON
    if (powerOn) {
        showMessage("Good morning my Iah! How are you? I hope you're doing well 💖");
    }
}

function calculate() {
    try {
        const expression = result.value.trim();

        // Check if it's an addition equation
        const isAddition = /^[\d\s.]+\+[\d\s.]+$/.test(expression);

        // Evaluate result first (in case we need it)
        const computed = eval(expression) || '';

        // If power is ON and it's an addition, show message + play sound,
        // but DO NOT show the result
        if (powerOn && isAddition) {
            showMessage("Surprise, this is for you 💝");

            // Stop any playing audio first
            document.querySelectorAll('audio').forEach(audio => {
                if (!audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });

            // Play the Christmas sound
            const christmasAudio = document.getElementById('christmasSound');
            christmasAudio.currentTime = 0;
            christmasAudio.play().catch(err => console.log("Christmas sound failed:", err));

            // Keep the screen blank (no result shown)
            result.value = '';
        } else {
            // If power is OFF or not addition, show normal calculation
            result.value = computed;
        }
    } catch {
        result.value = 'Error';
    }
}

// Modal Logic (Open/Close)
const modal = document.getElementById('hiModal');
const btn = document.getElementById('hiBtn');
const span = document.querySelector('.close');

btn.onclick = () => modal.style.display = 'block';
span.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target === modal) modal.style.display = 'none';
};

// Carousel Logic (New: Swipes and Dots)
let currentIndex = 1;
const slidesContainer = document.querySelector('.slides-container');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

let startX = 0;
let currentX = 0;

// Function to update carousel position and active states
function updateCarousel() {
    const translateX = - (currentIndex * 100);
    slidesContainer.style.transform = `translateX(${translateX}%)`;

    // Update active dot
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });

    // Optional: Update active slide class if needed for additional styling
    document.querySelectorAll('.slide').forEach((slide, index) => {
        slide.classList.toggle('active', index === currentIndex);
    });
}

// Swipe Event Listeners
slidesContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

slidesContainer.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent page scroll during swipe
});

slidesContainer.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    currentX = e.changedTouches[0].clientX;
    const deltaX = currentX - startX;

    // Only trigger if swipe is significant (50px threshold)
    if (Math.abs(deltaX) > 50) {
        if (deltaX > 0 && currentIndex > 0) { // Swipe right: Go to previous slide
            currentIndex--;
        } else if (deltaX < 0 && currentIndex < totalSlides - 1) { // Swipe left: Go to next slide
            currentIndex++;
        }
        updateCarousel();
    }
});

// Dots Click Listeners
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
    });
});

// Initialize carousel on load (optional, but ensures it's set)
updateCarousel();

// Power Toggle Logic
const powerBtn = document.getElementById('powerBtn');
let powerOn = false;

powerBtn.addEventListener('click', () => {
    powerOn = !powerOn;
    powerBtn.classList.toggle('on', powerOn);
    powerBtn.textContent = powerOn ? '🟢' : '🔴';
});

// Function to show sliding message
function showMessage(text) {
    const container = document.getElementById('messageContainer');
    const audio = document.getElementById('ayaSound');

    container.innerHTML = ''; // clear any previous message

    const msg = document.createElement('span');
    msg.textContent = text;
    container.appendChild(msg);

    // Play Aya sound
    if (audio) {
        audio.currentTime = 0; // restart from beginning
        audio.play().catch(err => {
            console.log("Audio playback failed:", err);
        });
    }

    // Restart animation on loop
    msg.addEventListener('animationend', () => {
        msg.style.animation = 'none';
        void msg.offsetWidth; // reflow to restart
        msg.style.animation = 'slide-left 10s linear forwards';
    });
}