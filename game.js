document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let grid = [];
    let score = 0;
    let gameOver = false;
    let bestScore = localStorage.getItem('bestScore') || 0;
    
    // DOM elements
    const gridContainer = document.querySelector('.grid-container');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const newGameButton = document.getElementById('new-game');
    const gameMessage = document.querySelector('.game-message');
    const tryAgainButton = gameMessage.querySelector('button');
    
    // Initialize the game
    function initGame() {
        // Reset game state
        grid = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        gameOver = false;
        
        // Update UI
        updateScore();
        gameMessage.style.display = 'none';
        gameMessage.classList.remove('game-over');
        
        // Clear the grid
        gridContainer.innerHTML = '';
        
        // Create grid cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                gridContainer.appendChild(cell);
            }
        }
        
        // Add initial tiles
        addRandomTile();
        addRandomTile();
    }
    
    // Add a random tile (2 or 4) to an empty cell
    function addRandomTile() {
        const emptyCells = [];
        
        // Find all empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        
        // If there are empty cells, add a new tile
        if (emptyCells.length > 0) {
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[row][col] = Math.random() < 0.9 ? 2 : 4;
            createTile(row, col, grid[row][col]);
            
            // Check if game is over after adding a new tile
            if (isGameOver()) {
                endGame();
            }
        }
    }
    
    // Create a tile element
    function createTile(row, col, value, isNew = true) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.value = value;
        tile.textContent = value;
        
        // Position the tile
        updateTilePosition(tile, row, col);
        
        // Add animation for new tiles
        if (isNew) {
            tile.style.opacity = '0';
            tile.style.transform = 'scale(0)';
            setTimeout(() => {
                tile.style.transition = 'opacity 0.1s ease, transform 0.1s ease';
                tile.style.opacity = '1';
                tile.style.transform = 'scale(1)';
            }, 10);
        }
        
        gridContainer.appendChild(tile);
        return tile;
    }
    
    // Update tile position
    function updateTilePosition(tile, row, col) {
        const size = gridContainer.offsetWidth / 4;
        const x = col * size + 15 * (col + 1);
        const y = row * size + 15 * (row + 1);
        
        tile.style.width = `${size - 15}px`;
        tile.style.height = `${size - 15}px`;
        tile.style.left = `${x}px`;
        tile.style.top = `${y}px`;
    }
    
    // Move tiles in a specific direction
    function moveTiles(direction) {
        if (gameOver) return false;
        
        let moved = false;
        const oldGrid = JSON.stringify(grid);
        
        // Create a copy of the current grid for comparison
        const previousGrid = JSON.parse(JSON.stringify(grid));
        
        // Process the move based on direction
        switch (direction) {
            case 'up':
                moved = moveUp();
                break;
            case 'right':
                moved = moveRight();
                break;
            case 'down':
                moved = moveDown();
                break;
            case 'left':
                moved = moveLeft();
                break;
        }
        
        // If the grid changed, add a new tile
        if (moved) {
            // Animate the movement
            updateTilesAfterMove(previousGrid);
            
            // Add a small delay before adding a new tile
            setTimeout(() => {
                addRandomTile();
            }, 150);
        }
        
        return moved;
    }
    
    // Move tiles up
    function moveUp() {
        let moved = false;
        
        for (let col = 0; col < 4; col++) {
            // Move all tiles up as far as possible
            for (let row = 1; row < 4; row++) {
                if (grid[row][col] !== 0) {
                    let currentRow = row;
                    
                    while (currentRow > 0 && grid[currentRow - 1][col] === 0) {
                        grid[currentRow - 1][col] = grid[currentRow][col];
                        grid[currentRow][col] = 0;
                        currentRow--;
                        moved = true;
                    }
                }
            }
            
            // Merge tiles
            for (let row = 0; row < 3; row++) {
                if (grid[row][col] !== 0 && grid[row][col] === grid[row + 1][col]) {
                    grid[row][col] *= 2;
                    grid[row + 1][col] = 0;
                    score += grid[row][col];
                    updateScore();
                    moved = true;
                    
                    // Move any tiles above the merged tile down
                    for (let r = row + 1; r < 3; r++) {
                        grid[r][col] = grid[r + 1][col];
                        grid[r + 1][col] = 0;
                    }
                }
            }
        }
        
        return moved;
    }
    
    // Move tiles right (similar logic for other directions)
    function moveRight() {
        let moved = false;
        
        for (let row = 0; row < 4; row++) {
            for (let col = 2; col >= 0; col--) {
                if (grid[row][col] !== 0) {
                    let currentCol = col;
                    
                    while (currentCol < 3 && grid[row][currentCol + 1] === 0) {
                        grid[row][currentCol + 1] = grid[row][currentCol];
                        grid[row][currentCol] = 0;
                        currentCol++;
                        moved = true;
                    }
                }
            }
            
            for (let col = 3; col > 0; col--) {
                if (grid[row][col] !== 0 && grid[row][col] === grid[row][col - 1]) {
                    grid[row][col] *= 2;
                    grid[row][col - 1] = 0;
                    score += grid[row][col];
                    updateScore();
                    moved = true;
                    
                    for (let c = col - 1; c > 0; c--) {
                        grid[row][c] = grid[row][c - 1];
                        grid[row][c - 1] = 0;
                    }
                }
            }
        }
        
        return moved;
    }
    
    // Move tiles down (similar logic)
    function moveDown() {
        let moved = false;
        
        for (let col = 0; col < 4; col++) {
            for (let row = 2; row >= 0; row--) {
                if (grid[row][col] !== 0) {
                    let currentRow = row;
                    
                    while (currentRow < 3 && grid[currentRow + 1][col] === 0) {
                        grid[currentRow + 1][col] = grid[currentRow][col];
                        grid[currentRow][col] = 0;
                        currentRow++;
                        moved = true;
                    }
                }
            }
            
            for (let row = 3; row > 0; row--) {
                if (grid[row][col] !== 0 && grid[row][col] === grid[row - 1][col]) {
                    grid[row][col] *= 2;
                    grid[row - 1][col] = 0;
                    score += grid[row][col];
                    updateScore();
                    moved = true;
                    
                    for (let r = row - 1; r > 0; r--) {
                        grid[r][col] = grid[r - 1][col];
                        grid[r - 1][col] = 0;
                    }
                }
            }
        }
        
        return moved;
    }
    
    // Move tiles left (similar logic)
    function moveLeft() {
        let moved = false;
        
        for (let row = 0; row < 4; row++) {
            for (let col = 1; col < 4; col++) {
                if (grid[row][col] !== 0) {
                    let currentCol = col;
                    
                    while (currentCol > 0 && grid[row][currentCol - 1] === 0) {
                        grid[row][currentCol - 1] = grid[row][currentCol];
                        grid[row][currentCol] = 0;
                        currentCol--;
                        moved = true;
                    }
                }
            }
            
            for (let col = 0; col < 3; col++) {
                if (grid[row][col] !== 0 && grid[row][col] === grid[row][col + 1]) {
                    grid[row][col] *= 2;
                    grid[row][col + 1] = 0;
                    score += grid[row][col];
                    updateScore();
                    moved = true;
                    
                    for (let c = col + 1; c < 3; c++) {
                        grid[row][c] = grid[row][c + 1];
                        grid[row][c + 1] = 0;
                    }
                }
            }
        }
        
        return moved;
    }
    
    // Update tile positions after a move
    function updateTilesAfterMove(previousGrid) {
        const tiles = document.querySelectorAll('.tile');
        
        // Remove tiles that were merged
        tiles.forEach(tile => {
            const value = parseInt(tile.dataset.value);
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            
            // If this tile was merged, remove it
            if (grid[row][col] !== value) {
                tile.classList.add('merged');
                setTimeout(() => {
                    tile.remove();
                }, 200);
            }
        });
        
        // Update positions of remaining tiles
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (grid[row][col] !== 0) {
                    const value = grid[row][col];
                    let tile = findTileAtPosition(row, col, tiles);
                    
                    if (!tile) {
                        // If no tile exists at this position, create a new one
                        tile = createTile(row, col, value, false);
                    } else if (previousGrid[row][col] !== value) {
                        // If the value changed (due to merge), update the tile
                        tile.dataset.value = value;
                        tile.textContent = value;
                        tile.classList.add('merged');
                        setTimeout(() => tile.classList.remove('merged'), 200);
                    }
                    
                    // Update position with animation
                    tile.style.transition = 'left 0.1s ease, top 0.1s ease';
                    updateTilePosition(tile, row, col);
                    tile.dataset.row = row;
                    tile.dataset.col = col;
                }
            }
        }
    }
    
    // Find a tile at a specific position
    function findTileAtPosition(row, col, tiles) {
        for (const tile of tiles) {
            const tileRow = parseInt(tile.dataset.row);
            const tileCol = parseInt(tile.dataset.col);
            
            if (tileRow === row && tileCol === col) {
                return tile;
            }
        }
        return null;
    }
    
    // Check if the game is over
    function isGameOver() {
        // Check for any empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // Check for possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const value = grid[i][j];
                
                // Check right neighbor
                if (j < 3 && grid[i][j + 1] === value) {
                    return false;
                }
                
                // Check bottom neighbor
                if (i < 3 && grid[i + 1][j] === value) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // End the game
    function endGame() {
        gameOver = true;
        gameMessage.style.display = 'flex';
        gameMessage.classList.add('game-over');
        gameMessage.querySelector('p').textContent = 'Game Over!';
        
        // Update best score
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            bestScoreDisplay.textContent = bestScore;
        }
    }
    
    // Update the score display
    function updateScore() {
        scoreDisplay.textContent = score;
        
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            bestScoreDisplay.textContent = bestScore;
        }
    }
    
    // Handle keyboard events
    function handleKeyDown(event) {
        if (gameOver) return;
        
        let moved = false;
        
        switch (event.key) {
            case 'ArrowUp':
                moved = moveTiles('up');
                break;
            case 'ArrowRight':
                moved = moveTiles('right');
                break;
            case 'ArrowDown':
                moved = moveTiles('down');
                break;
            case 'ArrowLeft':
                moved = moveTiles('left');
                break;
            default:
                return; // Ignore other keys
        }
        
        // Prevent default only for arrow keys to avoid page scrolling
        if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.key)) {
            event.preventDefault();
        }
    }
    
    // Handle touch events for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }
    
    function handleTouchEnd(event) {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Only consider the greater difference in direction
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0) {
                moveTiles('left');
            } else {
                moveTiles('right');
            }
        } else {
            // Vertical swipe
            if (diffY > 0) {
                moveTiles('down');
            } else {
                moveTiles('up');
            }
        }
        
        // Reset touch coordinates
        touchStartX = 0;
        touchStartY = 0;
    }
    
    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    
    // New game button
    newGameButton.addEventListener('click', initGame);
    tryAgainButton.addEventListener('click', initGame);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        document.querySelectorAll('.tile').forEach(tile => {
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            updateTilePosition(tile, row, col);
        });
    });
    
    // Initialize the game
    initGame();
});
