const result = document.getElementById('result');
const powerBtn = document.getElementById('powerBtn');
let powerOn = false;

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

    // Stop any playing audio first
    document.querySelectorAll('audio').forEach(audio => {
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });

    // Show message if power is ON
    if (powerOn) {
        showMessage("Good morning my Iah! How are you? I hope you're doing well 💖");
    }
}

function calculate() {
    try {
        const expression = result.value.trim();

        // Check if it's an addition, subtraction, multiplication, or division equation
        const isAddition = /^[\d\s.]+\+[\d\s.]+$/.test(expression);
        const isSubtraction = /^[\d\s.]+-[\d\s.]+$/.test(expression.replace(/\s+/g, ''));
        const isMultiplication = /^[\d\s.]+\*[\d\s.]+$/.test(expression.replace(/\s+/g, ''));
        const isDivision = /^[\d\s.]+\/[\d\s.]+$/.test(expression.replace(/\s+/g, ''));

        // Evaluate result first
        const computed = eval(expression) || '';

        // Helper: plays message with animation + optional sound
        function animatedMessage(text, audioId) {
            const container = document.getElementById('messageContainer');
            container.innerHTML = '';

            const msg = document.createElement('span');
            msg.textContent = text;
            container.appendChild(msg);

            // Wait for the element to be rendered to get accurate width
            requestAnimationFrame(() => {
                const msgWidth = msg.offsetWidth;
                const containerWidth = container.offsetWidth;
                const distance = msgWidth + containerWidth;
                const speed = 50; // pixels per second
                const duration = distance / speed;

                msg.style.animation = `slide-left ${duration}s linear forwards`;

                msg.addEventListener('animationend', () => {
                    msg.style.animation = 'none';
                    void msg.offsetWidth;
                    msg.style.animation = `slide-left ${duration}s linear forwards`;
                });
            });

            // Play the sound
            const audio = document.getElementById(audioId);
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(err => console.log("Sound failed:", err));
            }
        }

        // --- Special Reactions ---
        if (powerOn && isAddition) {
            document.querySelectorAll('audio').forEach(audio => {
                audio.pause(); audio.currentTime = 0;
            });
            animatedMessage(
                "STRESSED when spelled backward is DESSERTS, stressed diay ka ron? tara let's grab an ice cream or we eat cakes together?",
                'stressedFunctionSound'
            );
            result.value = '';

        } else if (powerOn && isSubtraction) {
            document.querySelectorAll('audio').forEach(audio => {
                audio.pause(); audio.currentTime = 0;
            });
            animatedMessage(
                "Need a fresh air? Tara iaaah, jog taaa? Or if di ka gusto ug sington ka or kapuyan ka, we can go outside pahangin ta sakay ka saako kay nagi, dalhon taka duol sa nature, and don't worry safe ka with me.",
                'overwhelmedFunctionSound'
            );
            result.value = '';

        } else if (powerOn && isMultiplication) {
            document.querySelectorAll('audio').forEach(audio => {
                audio.pause(); audio.currentTime = 0;
            });
            animatedMessage(
                "I know it's getting tougher and tougher each day. All the pressures are sinking in, but just know I believed in you. You're really a hardworking person and I know you can do it. If kaya sa uban, I know mas kaya nimo. All of your prayers and even those persons who prayed for you will be answered. Trust yourself lng jd, smart man ka iah. Naay times mu ingon kag 'chamba lang', but there's no such thing as 'chamba'. Tungod na saimong hardwork and intelligence. Ayaw lng give up saimong goal. Kaya na nimo, ikaw pa! Ikaw nagud na!",
                'encouragementFunctionSound'
            );
            result.value = '';

        } else if (powerOn && isDivision) {
            document.querySelectorAll('audio').forEach(audio => {
                audio.pause(); audio.currentTime = 0;
            });
            animatedMessage(
                "Awhhh... Whyyy? Dili ko nimo gina tuohan pero tinuod baya jd na akong mga compliments. Mu ingon ka na tanga kaayo ka sa mga picture tapos gusto ka idelete nako pero behind those pictures there's no such thing na tanga, pangit, or a bad photo. Kay basking kinsa pa na lalake ipakita to, maka admire jd sila saimong beauty. Just like how I admire you. You're stunning, you're gorgeous, you're blooming, you're pretty, you're every beautiful words I can think off. I love just the way you are. So smile na, cause your smile is really priceless.",
                'insecureFunctionSound'
            );
            result.value = '';

        } else {
            // Normal calculation behavior
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

    // Update active slide class for styling
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentIndex);
    });
}

// Swipe Event Listeners
slidesContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    // console.log('touchstart', startX);
});

slidesContainer.addEventListener('touchmove', (e) => {
    if (!e.touches || e.touches.length === 0) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;

    // Only prevent default if horizontal swipe is significant
    if (Math.abs(deltaX) > 10) {
        e.preventDefault();
    }
});

slidesContainer.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    currentX = e.changedTouches[0].clientX;
    const deltaX = currentX - startX;
    // console.log('touchend', currentX, 'deltaX:', deltaX);

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

// Initialize carousel on load
updateCarousel();

// Power Toggle Logic
powerBtn.addEventListener('click', () => {
    powerOn = !powerOn;
    powerBtn.classList.toggle('on', powerOn);
    powerBtn.textContent = powerOn ? '🟢' : '🔴';

    if (powerOn) {
        // When turned ON — clear the display
        result.value = '';
    } else {
        // When turned OFF — clear everything
        clearAll();
    }
});

// Function to show sliding message
function showMessage(text) {
    const container = document.getElementById('messageContainer');
    const audio = document.getElementById('mainFunctionSound');

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