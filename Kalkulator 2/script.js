let audioContext;
let clickBuffer;

window.addEventListener('load', function() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    loadSound('pick-92276.mp3').then(buffer => {
        clickBuffer = buffer;
    });
});

function loadSound(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

function playSound(buffer) {
    if (audioContext && buffer) {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
    }
}

function appendToDisplay(value) {
    document.getElementById('display').value += value;
    animateButton(event.target);
    playSound(clickBuffer);
}

function clearDisplay() {
    document.getElementById('display').value = '';
    animateButton(event.target);
    playSound(clickBuffer);
}

function calculate() {
    try {
        document.getElementById('display').value = eval(document.getElementById('display').value);
    } catch (error) {
        document.getElementById('display').value = 'Error';
    }
    animateButton(event.target);
    playSound(clickBuffer);
}

function animateDisplay() {
    const display = document.getElementById('display');
    display.classList.add('glow');
    setTimeout(() => {
        display.classList.remove('glow');
    }, 500);
}

function animateButton(button) {
    button.classList.add('animate');
    setTimeout(() => {
        button.classList.remove('animate');
    }, 200);
}

function backspace() {
    let display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
    animateButton(event.target);
    playSound(clickBuffer);
}

window.onload = animateDisplay;
