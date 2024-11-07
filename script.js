let sudokuGrid = Array(9).fill().map(() => Array(9).fill(0)); // 9x9 empty grid initialized

// Render the Sudoku grid as an HTML table
function renderGrid() {
    const gridContainer = document.getElementById('sudoku-grid');
    gridContainer.innerHTML = ''; // Clear any existing grid

    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.max = '9';
            input.value = sudokuGrid[row][col] === 0 ? '' : sudokuGrid[row][col];
            input.disabled = sudokuGrid[row][col] !== 0; // Disable if the cell has a value (pre-filled)

            input.setAttribute('data-row', row);
            input.setAttribute('data-col', col);
            input.addEventListener('input', updateGrid);
            td.appendChild(input);
            tr.appendChild(td);
        }
        gridContainer.appendChild(tr);
    }
}

// Update the sudokuGrid array based on user input
function updateGrid(event) {
    const row = event.target.getAttribute('data-row');
    const col = event.target.getAttribute('data-col');
    sudokuGrid[row][col] = parseInt(event.target.value) || 0;
}

// Check if it's safe to place a number at (row, col)
function isSafe(grid, row, col, num) {
    // Check row
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num) return false;
    }
    // Check column
    for (let i = 0; i < 9; i++) {
        if (grid[i][col] === num) return false;
    }
    // Check 3x3 grid
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (grid[i][j] === num) return false;
        }
    }
    return true;
}

// Backtracking algorithm to solve the Sudoku puzzle
function solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                // Try every number from 1 to 9
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(grid, row, col, num)) {
                        grid[row][col] = num;

                        // Recursively attempt to solve the rest of the grid
                        if (solveSudoku(grid)) {
                            return true;
                        }

                        // If no valid number is found, backtrack
                        grid[row][col] = 0;
                    }
                }
                return false; // If no valid number can be placed, backtrack
            }
        }
    }
    return true; // Sudoku solved
}

// Solve the puzzle when the user clicks the "Solve" button
function solvePuzzle() {
    const gridCopy = JSON.parse(JSON.stringify(sudokuGrid)); // Make a copy of the grid
    const solved = solveSudoku(gridCopy);

    if (solved) {
        sudokuGrid = gridCopy; // Update the grid with the solved solution
        renderGrid();
        displayMessage("Puzzle solved successfully!");
    } else {
        displayMessage("No solution exists.");
    }
}

// Clear the grid for new input
function clearGrid() {
    sudokuGrid = Array(9).fill().map(() => Array(9).fill(0)); // Reset to an empty grid
    renderGrid();
    document.getElementById('message').textContent = ''; // Clear any messages
}

// Display a message based on the solution
function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
}

// Initialize the grid when the page loads
renderGrid();

// Event listeners for buttons
document.getElementById('solve-button').addEventListener('click', solvePuzzle);
document.getElementById('clear-button').addEventListener('click', clearGrid);
