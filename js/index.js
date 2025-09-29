const result = document.getElementById('result');

function append(value) {
    result.value += value;
}

function clearAll() {
    result.value = '';
}

function clearOne() {
    result.value = result.value.slice(0, -1);
}

function calculate() {
    try {
        result.value = eval(result.value) || '';
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
const totalSlides = 3;
const slidesContainer = document.querySelector('.slides-container');
const dots = document.querySelectorAll('.dot');

let startX = 0;
let currentX = 0;

// Function to update carousel position and active states
function updateCarousel() {
    const translateX = - (currentIndex * (100 / totalSlides));
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