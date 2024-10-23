const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Biến toàn cục
let player = {
    x: 50,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    color: 'green',
    alive: true,
    dy: 0,
    onGround: false,
};

let ground = {
    x: 0,
    y: canvas.height - 20,
    width: canvas.width,
    height: 20,
    color: 'brown',
};

let obstacles = [
    { x: canvas.width - 100, y: canvas.height - 40, width: 30, height: 30, color: 'blue', dx: -2 },
    { x: canvas.width - 200, y: canvas.height - 150, width: 30, height: 30, color: 'purple', dx: -2 }
];

let collectibles = [
    { x: 300, y: canvas.height - 30, width: 20, height: 20, color: 'gold' },
];

let score = 0; // Điểm số
let gameState = "start"; // Trạng thái game

// Hàm khởi động lại trò chơi
function resetGame() {
    player.x = 50;
    player.y = canvas.height - 50;
    player.alive = true;
    player.dy = 0;
    player.onGround = false;

    obstacles = [
        { x: canvas.width - 100, y: canvas.height - 40, width: 30, height: 30, color: 'blue', dx: -2 },
        { x: canvas.width - 200, y: canvas.height - 150, width: 30, height: 30, color: 'purple', dx: -2 }
    ];

    score = 0;

    collectibles = [
        { x: Math.random() * canvas.width, y: canvas.height - 30, width: 20, height: 20, color: 'gold' }
    ];
}

// Hàm cập nhật trạng thái game
function update() {
    if (gameState === "playing") {
        if (player.alive) {
            player.y += player.dy;

            // Di chuyển nhân vật
            if (rightPressed && player.x < canvas.width - player.width) {
                player.x += 5; // Di chuyển sang phải
            }
            if (leftPressed && player.x > 0) {
                player.x -= 5; // Di chuyển sang trái
            }

            // Nhảy nếu nhân vật trên mặt đất
            if (player.onGround) {
                player.dy = 0;
                if (spacePressed) {
                    player.dy = -10; // Độ cao nhảy
                    player.onGround = false; // Đánh dấu nhân vật không còn trên mặt đất
                }
            }

            // Kiểm tra va chạm với mặt đất
            if (player.y + player.height >= ground.y) {
                player.y = ground.y - player.height;
                player.onGround = true; // Đánh dấu nhân vật đã chạm mặt đất
            } else {
                player.dy += 0.5; // Gia tốc trọng lực
            }

            // Cập nhật vị trí chướng ngại vật
            obstacles.forEach((obstacle) => {
                obstacle.x += obstacle.dx;
                if (obstacle.x + obstacle.width < 0) {
                    obstacle.x = canvas.width;
                }

                // Kiểm tra va chạm
                if (
                    player.x < obstacle.x + obstacle.width &&
                    player.x + player.width > obstacle.x &&
                    player.y < obstacle.y + obstacle.height &&
                    player.y + player.height > obstacle.y
                ) {
                    player.alive = false; // Nhân vật chết
                    gameState = "gameOver"; // Đổi sang trạng thái game over
                }
            });

            // Kiểm tra thu thập điểm thưởng
            collectibles.forEach((collectible, index) => {
                if (
                    player.x < collectible.x + collectible.width &&
                    player.x + player.width > collectible.x &&
                    player.y < collectible.y + collectible.height &&
                    player.y + player.height > collectible.y
                ) {
                    score++; // Tăng điểm số
                    collectibles.splice(index, 1); // Xóa điểm thưởng
                    collectibles.push({ x: Math.random() * canvas.width, y: canvas.height - 30, width: 20, height: 20, color: 'gold' }); // Thêm điểm thưởng mới
                }
            });
        }
    }
}

// Hàm vẽ các đối tượng trên màn hình
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ mặt đất
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

    if (gameState === "start") {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Nhấn Enter để bắt đầu", canvas.width / 2 - 150, canvas.height / 2);
    } else if (gameState === "gameOver") {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over! Nhấn Enter để chơi lại", canvas.width / 2 - 200, canvas.height / 2);
    } else {
        // Vẽ nhân vật
        if (player.alive) {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }

        // Vẽ chướng ngại vật
        obstacles.forEach((obstacle) => {
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });

        // Vẽ điểm thưởng
        collectibles.forEach((collectible) => {
            ctx.fillStyle = collectible.color;
            ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
        });

        // Hiển thị điểm số
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Điểm: " + score, 10, 20);

        // Vẽ nút điều khiển
        drawControlButtons();
    }
}

// Hàm vẽ các nút điều khiển
function drawControlButtons() {
    // Nút trái
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(20, canvas.height - 80, 50, 50);
    ctx.fillStyle = 'black';
    ctx.fillText("←", 40, canvas.height - 50);

    // Nút phải
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(80, canvas.height - 80, 50, 50);
    ctx.fillStyle = 'black';
    ctx.fillText("→", 100, canvas.height - 50);

    // Nút nhảy
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(150, canvas.height - 80, 50, 50);
    ctx.fillStyle = 'black';
    ctx.fillText("↑", 170, canvas.height - 50);
}

// Hàm xử lý sự kiện nhấn chuột
canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Nút trái
    if (mouseX > 20 && mouseX < 70 && mouseY > canvas.height - 80 && mouseY < canvas.height - 30) {
        leftPressed = true;
    }

    // Nút phải
    if (mouseX > 80 && mouseX < 130 && mouseY > canvas.height - 80 && mouseY < canvas.height - 30) {
        rightPressed = true;
    }

    // Nút nhảy
    if (mouseX > 150 && mouseX < 200 && mouseY > canvas.height - 80 && mouseY < canvas.height - 30) {
        spacePressed = true;
    }
});

// Hàm xử lý sự kiện nhả chuột
canvas.addEventListener('mouseup', () => {
    leftPressed = false;
    rightPressed = false;
    spacePressed = false;
});

// Điều khiển bàn phím
let spacePressed = false;
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        if (gameState === "start" || gameState === "gameOver") {
            gameState = "playing"; // Bắt đầu trò chơi
            resetGame(); // Khởi động lại trò chơi
        }
    }
    if (event.key === "ArrowLeft") {
        leftPressed = true; // Di chuyển sang trái
    }
    if (event.key === "ArrowRight") {
        rightPressed = true; // Di chuyển sang phải
    }
    if (event.key === "ArrowUp" && player.onGround) {
        spacePressed = true; // Nhảy
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === "ArrowLeft") {        leftPressed = false; // Ngừng di chuyển sang trái
    }
    if (event.key === "ArrowRight") {
        rightPressed = false; // Ngừng di chuyển sang phải
    }
    if (event.key === "ArrowUp") {
        spacePressed = false; // Ngừng nhảy
    }
});

// Hàm lặp game
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Khởi động game
gameLoop();

