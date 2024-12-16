const canvas = document.getElementById('board');
const nextCanvas = document.getElementById('next-piece');
const ctx = canvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('game-overlay');
const restartBtn = document.getElementById('restart-btn');
const finalScoreElement = document.getElementById('final-score');
const highScoreElement = document.getElementById('high-score');
const linesElement = document.getElementById('lines');

// Ukuran canvas
canvas.width = 300;
canvas.height = 600;
nextCanvas.width = 120;
nextCanvas.height = 120;

// Ukuran block
const blockSize = 30;
const COLS = canvas.width / blockSize;
const ROWS = canvas.height / blockSize;

// Warna-warna pieces
const COLORS = [
    '#00ff00', // I
    '#ff0000', // O
    '#0000ff', // T
    '#ffff00', // L
    '#00ffff', // J
    '#ff00ff', // S
    '#ff8800'  // Z
];

// Bentuk pieces
const SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]]
];

let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let gameOver = false;
let gameLoop = null;
let dropInterval = 1000;
let lastDrop = 0;
let highScore = localStorage.getItem('tetrisHighScore') || 0;
let totalLines = 0;
let comboCount = 0;
let lastClearTime = 0;

highScoreElement.textContent = highScore;

// Inisialisasi board
function initBoard() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
}

// Membuat piece baru
class Piece {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.row = 0;
        this.col = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2);
    }
}

// Generate piece baru
function generatePiece() {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return new Piece(SHAPES[shapeIndex], COLORS[shapeIndex]);
}

// Menggambar piece
function drawPiece(ctx, piece, offsetX = 0, offsetY = 0) {
    piece.shape.forEach((row, i) => {
        row.forEach((value, j) => {
            if (value) {
                ctx.fillStyle = piece.color;
                ctx.fillRect(
                    (piece.col + j) * blockSize + offsetX,
                    (piece.row + i) * blockSize + offsetY,
                    blockSize - 1,
                    blockSize - 1
                );
            }
        });
    });
}

// Menggambar next piece
function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (nextPiece) {
        const offsetX = (nextCanvas.width - nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (nextCanvas.height - nextPiece.shape.length * blockSize) / 2;
        drawPiece(nextCtx, {
            ...nextPiece,
            row: 0,
            col: 0
        }, offsetX, offsetY);
    }
}

// Menggambar board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#333';
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            ctx.strokeRect(j * blockSize, i * blockSize, blockSize, blockSize);
        }
    }
    
    // Draw pieces
    board.forEach((row, i) => {
        row.forEach((value, j) => {
            if (value) {
                ctx.fillStyle = COLORS[value - 1];
                ctx.fillRect(j * blockSize, i * blockSize, blockSize - 1, blockSize - 1);
            }
        });
    });

    if (currentPiece) {
        drawPiece(ctx, currentPiece);
    }
}

// Collision detection
function hasCollision(piece) {
    return piece.shape.some((row, i) => {
        return row.some((value, j) => {
            if (!value) return false;
            const newRow = piece.row + i;
            const newCol = piece.col + j;
            return newRow >= ROWS || newCol < 0 || newCol >= COLS || 
                   (newRow >= 0 && board[newRow][newCol]);
        });
    });
}

// Merge piece to board
function mergePiece(piece) {
    piece.shape.forEach((row, i) => {
        row.forEach((value, j) => {
            if (value) {
                board[piece.row + i][piece.col + j] = COLORS.indexOf(piece.color) + 1;
            }
        });
    });
}

// Tambahkan fungsi ini untuk efek partikel saat menghapus baris
function createParticles(row) {
    const particles = [];
    for (let i = 0; i < COLS; i++) {
        particles.push({
            x: i * blockSize,
            y: row * blockSize,
            dx: (Math.random() - 0.5) * 10,
            dy: (Math.random() - 4) * 10,
            alpha: 1
        });
    }
    return particles;
}

// Update fungsi clearLines
function clearLines() {
    let linesCleared = 0;
    let particles = [];
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            particles = particles.concat(createParticles(row));
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++;
        }
    }
    
    if (linesCleared > 0) {
        // Combo system
        const now = performance.now();
        if (now - lastClearTime < 1000) {
            comboCount++;
        } else {
            comboCount = 0;
        }
        lastClearTime = now;
        
        const baseScore = linesCleared * 100;
        const comboBonus = comboCount * 50;
        const levelBonus = level * 50;
        score += (baseScore + comboBonus) * level;
        
        totalLines += linesCleared;
        
        scoreElement.textContent = score;
        linesElement.textContent = totalLines;
        
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('tetrisHighScore', highScore);
        }
        
        // Level up setiap 10 baris
        const newLevel = Math.floor(totalLines / 10) + 1;
        if (newLevel !== level) {
            level = newLevel;
            levelElement.textContent = level;
            dropInterval = Math.max(100, 1000 - (level - 1) * 100);
            
            // Flash effect pada level up
            document.body.style.backgroundColor = '#003300';
            setTimeout(() => {
                document.body.style.backgroundColor = '#1a1a1a';
            }, 100);
        }
        
        // Animate particles
        let particleAnimation = requestAnimationFrame(function animateParticles() {
            ctx.save();
            particles.forEach((p, i) => {
                p.x += p.dx;
                p.y += p.dy;
                p.dy += 0.5;
                p.alpha -= 0.02;
                
                if (p.alpha > 0) {
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(p.x, p.y, 3, 3);
                } else {
                    particles.splice(i, 1);
                }
            });
            ctx.restore();
            
            if (particles.length > 0) {
                requestAnimationFrame(animateParticles);
            }
        });
    }
}

// Update fungsi game over
function showGameOver() {
    overlay.classList.add('active');
    finalScoreElement.textContent = score;
}

// Update fungsi start game
function startGame() {
    overlay.classList.remove('active');
    initBoard();
    score = 0;
    level = 1;
    totalLines = 0;
    comboCount = 0;
    gameOver = false;
    dropInterval = 1000;
    scoreElement.textContent = '0';
    levelElement.textContent = '1';
    linesElement.textContent = '0';
    currentPiece = null;
    nextPiece = generatePiece();
    lastDrop = performance.now();
    requestAnimationFrame(update);
}

// Event listeners untuk restart
restartBtn.addEventListener('click', startGame);
startBtn.addEventListener('click', startGame);

// Update fungsi update untuk menampilkan game over
function update(timestamp) {
    if (gameOver) {
        showGameOver();
        return;
    }

    if (!currentPiece) {
        currentPiece = nextPiece || generatePiece();
        nextPiece = generatePiece();
        drawNextPiece();
        
        if (hasCollision(currentPiece)) {
            gameOver = true;
            alert('Game Over! Skor akhir: ' + score);
            return;
        }
    }

    // Auto-drop
    if (timestamp - lastDrop > dropInterval) {
        currentPiece.row++;
        if (hasCollision(currentPiece)) {
            currentPiece.row--;
            mergePiece(currentPiece);
            clearLines();
            currentPiece = null;
        }
        lastDrop = timestamp;
    }

    drawBoard();
    requestAnimationFrame(update);
}

// Controls
const controls = {
    left: () => {
        if (currentPiece && !gameOver) {
            currentPiece.col--;
            if (hasCollision(currentPiece)) {
                currentPiece.col++;
            }
        }
    },
    right: () => {
        if (currentPiece && !gameOver) {
            currentPiece.col++;
            if (hasCollision(currentPiece)) {
                currentPiece.col--;
            }
        }
    },
    down: () => {
        if (currentPiece && !gameOver) {
            currentPiece.row++;
            if (hasCollision(currentPiece)) {
                currentPiece.row--;
                mergePiece(currentPiece);
                clearLines();
                currentPiece = null;
            }
            lastDrop = performance.now();
        }
    },
    rotate: () => {
        if (currentPiece && !gameOver) {
            const rotated = currentPiece.shape[0].map((_, i) =>
                currentPiece.shape.map(row => row[row.length - 1 - i])
            );
            const previousShape = currentPiece.shape;
            currentPiece.shape = rotated;
            if (hasCollision(currentPiece)) {
                currentPiece.shape = previousShape;
            }
        }
    }
};

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': controls.left(); break;
        case 'ArrowRight': controls.right(); break;
        case 'ArrowDown': controls.down(); break;
        case 'ArrowUp': controls.rotate(); break;
    }
});

// Touch controls
const buttons = {
    'left-btn': controls.left,
    'right-btn': controls.right,
    'down-btn': controls.down,
    'rotate-btn': controls.rotate
};

Object.entries(buttons).forEach(([id, handler]) => {
    const button = document.getElementById(id);
    let intervalId = null;

    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handler();
        intervalId = setInterval(handler, 150);
    });

    button.addEventListener('touchend', () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    });
});

// Prevent zoom and scrolling
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// Resize handling
function resizeGame() {
    const maxWidth = Math.min(window.innerWidth - 20, 500);
    const scale = maxWidth / canvas.width;
    
    canvas.style.width = `${canvas.width * scale}px`;
    canvas.style.height = `${canvas.height * scale}px`;
}

// Initial setup
window.addEventListener('load', resizeGame);
window.addEventListener('resize', resizeGame);
