document.addEventListener("DOMContentLoaded", () => {
    const rocket = document.getElementById("rocket");
    const enemyRocket = document.getElementById("enemy-rocket");
    const gameContainer = document.querySelector(".game-container");
    const ammoDisplay = document.getElementById("ammo-display");
    const playerHealthDisplay = document.getElementById("player-health");
    const enemyHealthDisplay = document.getElementById("enemy-health");
    const scoreDisplay = document.getElementById("score-display");
    const highestScoreDisplay = document.getElementById("highest-score");
    const playButton = document.getElementById("play-button");
    const retryButton = document.getElementById("retry-button");

    let rocketX, rocketY, enemyX, enemyY, speed, ammo, isShooting, playerHealth, enemyHealth, score;
    let highestScore = localStorage.getItem("highestScore") ? parseInt(localStorage.getItem("highestScore")) : 0;
    let shootingInterval;

    // Initialize highest score display
    highestScoreDisplay.innerText = `Highest Score: ${highestScore}`;

    function resetGame() {
        rocketX = window.innerWidth / 2 - 50;
        rocketY = window.innerHeight - 100;
        enemyX = Math.random() * (window.innerWidth - 100);
        enemyY = 50;
        speed = 5;
        ammo = 20; // Ammo no longer has an impact as we will set it to unlimited
        isShooting = false;
        playerHealth = 10;
        enemyHealth = 1;
        score = 0;

        ammoDisplay.innerText = `ICT ROCKET SHOOTER GAME
        GRADE 11 TVL ICT Alino - batch 2023-2024
GRADE 12 TVL ICT Martinez - batch 2024-2025
KABACAN NATIONAL HIGH SCHOOL`; // Display as unlimited
        playerHealthDisplay.innerText = `Health: ${playerHealth}`;
        enemyHealthDisplay.innerText = `Enemy Health: ${enemyHealth}`;
        scoreDisplay.innerText = `Score: ${score}`;
        retryButton.style.display = "none";  // Hide retry button initially
    }

    // Hide the play button once the game starts
    playButton.addEventListener("click", () => {
        playButton.style.display = "none";  // Hide the play button
        gameContainer.style.cursor = "none"; // Hide cursor when the game starts
        updateRocketPosition(); // Start updating the player's rocket position
        updateEnemyPosition(); // Start the enemy rocket's falling behavior
    });

    // Show the retry button when the player loses
    function gameOver() {
        retryButton.style.display = "block"; // Show retry button
        rocket.style.display = "none"; // Hide the rocket
        enemyRocket.style.display = "none"; // Hide the enemy rocket
        gameContainer.style.cursor = "default"; // Show the cursor again when the game ends
        updateHighestScore(); // Check and update the highest score
    }

    // Reset the game when retry button is clicked
    retryButton.addEventListener("click", () => {
        resetGame();
        playButton.style.display = "block"; // Show play button again
        rocket.style.display = "block"; // Show the rocket again
        enemyRocket.style.display = "block"; // Show the enemy rocket again
        gameContainer.style.cursor = "none"; // Hide cursor during the game
    });

    // Update health display
    function updateHealthDisplay() {
        playerHealthDisplay.innerText = `Health: ${playerHealth}`;
        enemyHealthDisplay.innerText = `Enemy Health: ${enemyHealth}`;
        if (playerHealth <= 0) {
            gameOver(); // End the game if health is 0
        }
    }

    // Update score display
    function updateScore() {
        scoreDisplay.innerText = `Score: ${score}`;
    }

    let touchStartX, touchStartY, shootTouchStart;
    let isTouching = false;

    // Update rocket position for both mouse and touch controls
    function updateRocketPosition() {
        // Mouse control for desktop (Click and hold to move and shoot continuously)
        document.addEventListener("mousedown", (event) => {
            if (event.button === 0) { // Left mouse button
                isShooting = true;
                shootBullets(); // Start shooting
                moveRocket(event.clientX, event.clientY); // Move rocket
                if (!shootingInterval) { // Start shooting interval if not already shooting
                    shootingInterval = setInterval(shootBullets, 300); // Shoot every 300ms (slower fire rate)
                }
            }
        });

        document.addEventListener("mousemove", (event) => {
            if (isShooting) { // Move and shoot when mouse is held down
                moveRocket(event.clientX, event.clientY);
            }
        });

        document.addEventListener("mouseup", () => {
            isShooting = false; // Stop shooting when mouse button is released
            clearInterval(shootingInterval); // Stop the shooting interval
            shootingInterval = null; // Reset interval variable
        });

        // Touch control for mobile (Hold to move and shoot continuously)
        gameContainer.addEventListener("touchstart", (event) => {
            if (event.touches.length === 1) { // Only handle one touch (for mobile controls)
                isTouching = true;
                shootTouchStart = event.touches[0];
                shootBullets(); // Start shooting
                moveRocket(touchStartX, touchStartY); // Move rocket
                if (!shootingInterval) { // Start shooting interval if not already shooting
                    shootingInterval = setInterval(shootBullets, 300); // Shoot every 300ms (slower fire rate)
                }
            }
        });

        gameContainer.addEventListener("touchmove", (event) => {
            if (isTouching && event.touches.length === 1) {
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;

                moveRocket(touchStartX, touchStartY); // Move rocket
            }
        });

        gameContainer.addEventListener("touchend", () => {
            isTouching = false; // Stop shooting when touch ends
            clearInterval(shootingInterval); // Stop the shooting interval
            shootingInterval = null; // Reset interval variable
        });
    }

    function moveRocket(x, y) {
        rocketX = x - 50; // Adjust for rocket width
        rocketY = y - 50; // Adjust for rocket height

        // Prevent rocket from going out of bounds
        rocketX = Math.max(0, Math.min(window.innerWidth - 100, rocketX));
        rocketY = Math.max(0, Math.min(window.innerHeight - 100, rocketY));

        rocket.style.left = `${rocketX}px`;
        rocket.style.top = `${rocketY}px`;
    }

    // Shooting event for both mouse and touch controls
    function shootBullets() {
        const leftBullet = document.createElement("img");
        leftBullet.src = "bullet.png";
        leftBullet.classList.add("bullet");

        const rightBullet = document.createElement("img");
        rightBullet.src = "bullet.png";
        rightBullet.classList.add("bullet");

        gameContainer.appendChild(leftBullet);
        gameContainer.appendChild(rightBullet);

        let leftBulletX = rocketX + -0.22 * 100;
        let rightBulletX = rocketX + 0.05 * 100;
        let bulletY = rocketY;

        leftBullet.style.left = `${leftBulletX}px`;
        leftBullet.style.top = `${bulletY}px`;

        rightBullet.style.left = `${rightBulletX}px`;
        rightBullet.style.top = `${bulletY}px`;

        let bulletInterval = setInterval(() => {
            bulletY -= 10; // Bullet speed (upward movement)
            leftBullet.style.top = `${bulletY}px`;
            rightBullet.style.top = `${bulletY}px`;

            // Check if the bullet hits the enemy
            if (bulletY < enemyY + 100 && ((leftBulletX > enemyX && leftBulletX < enemyX + 100) ||
                (rightBulletX > enemyX && rightBulletX < enemyX + 100))) {
                respawnEnemy(); // Kill the enemy and respawn it
                score++; // Increase score by 1
                updateScore(); // Update score display
                clearInterval(bulletInterval); // Stop bullet movement
                leftBullet.remove();
                rightBullet.remove();
            }

            // If bullet goes off screen, remove it
            if (bulletY < 0) {
                clearInterval(bulletInterval);
                leftBullet.remove();
                rightBullet.remove();
            }
        }, 30);
    }

    function updateEnemyPosition() {
        enemyY += 3;

        // If the enemy rocket crosses the bottom, reduce player health
        if (enemyY > window.innerHeight) {
            playerHealth--; // Decrease player health
            updateHealthDisplay(); // Update health display
            respawnEnemy(); // Respawn enemy rocket at the top
        }

        enemyRocket.style.left = `${enemyX}px`;
        enemyRocket.style.top = `${enemyY}px`;

        requestAnimationFrame(updateEnemyPosition); // Keep updating position
    }

    function respawnEnemy() {
        enemyY = 50; // Reset enemy position
        enemyX = Math.random() * (window.innerWidth - 100); // Randomize horizontal position
    }

    function updateHighestScore() {
        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem("highestScore", highestScore);
            highestScoreDisplay.innerText = `Highest Score: ${highestScore}`;
        }
    }

    resetGame(); // Initialize the game
});
