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

// Modal Logic
const modal = document.getElementById('hiModal');
const btn = document.getElementById('hiBtn');
const span = document.querySelector('.close');

btn.onclick = () => modal.style.display = 'block';
span.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target === modal) modal.style.display = 'none';
};