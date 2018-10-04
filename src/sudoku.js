// Sudoku Module - Noah Yamamoto 2018

// Check if a passed board is full for base-case.
const isFull = (board) => {
  for (let i = 0; i < 9; i++) {
    for (let n = 0; n < 9; n++) {
      if (board[i][n] === 0) return false;
    }
  }
  return true;
};

// Randomly shuffle an array.
const shuffle = (arr) => {
  let j = 0;
  let temp;
  for (let i = arr.length - 1; i > 0; --i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

// Remove random spots from a solved board given a difficulty.
const removeSpots = (board, diff) => {
  // BUG: Sometimes impossible games aren't solvable
  // causing infinite loop and crashing the browser.
  // If a malformed puzzle is generated, solving or submitting will crash you.

  const removed = new Set();
  while (removed.size < diff) {
    const x = Math.floor((Math.random() * 9));
    const y = Math.floor((Math.random() * 9));
    // If our randomly chosen spot was already removed, choose a new one.
    if (!removed.has(`${x}${y}`)) {
      removed.add(`${x}${y}`);
      board[x][y] = 0;
    }
  }
  return board;
};

// Validate that a passed board is valid across row, col, block.
const validate = (board) => {
  // Accepts a full or unfinished board and returns
  // either true (indicating valid) or an array of
  // the offenders.

  // TODO: Optimize this.
  for (let i = 0; i < 9; ++i) { // Loop down the rows
    for (let j = 0; j < 9; ++j) { // Loop across the columns
      // Validate even if the board isn't full.
      const curr = board[i][j];
      if (curr === 0) continue;

      // Loop across the row (columns)
      for (let x = 0; x < 9; ++x) {
        // Ensure we're not checking ourself
        if (x === j) continue;
        if (curr === board[i][x]) return [[i, j], [i, x]];
      }

      // Loop down the column (rows)
      for (let y = 0; y < 9; ++y) {
        if (y === i) continue;
        if (curr === board[y][j]) return [[i, j], [y, j]];
      }

      // Check the block
      // First, find midpoint of whatever block we're in.
      const rowC = ((Math.floor(i / 3) + 1) * 3) - 2;
      const colC = ((Math.floor(j / 3) + 1) * 3) - 2;

      // Then check curr against its block neighbors.
      for (let x = rowC - 1; x <= rowC + 1; ++x) {
        for (let y = colC - 1; y <= colC + 1; ++y) {
          if (y === j) continue;
          if (board[x][y] === curr) return [[i, j], [x, y]];
        }
      }
    }
  }
  return true;
};

// Create array of possibilities for any given point.
const possibilities = (board, i, j) => {
  if (i > 8 || i < 0 || j > 8 || j < 0) throw new RangeError('Invalid coords.');
  if (board[i][j] !== 0) throw new Error('This spot is taken.');

  /* eslint-disable-next-line */
  const pos = [...Array.from(Array(9).keys())].map(v => 0);
  for (let x = 0; x < 9; ++x) { // Loop thru the row (i) horizontally.
    if (board[i][x] !== 0)++pos[board[i][x] - 1];
  }

  for (let y = 0; y < 9; ++y) { // Loop thru column (j) vertically.
    if (board[y][j] !== 0)++pos[board[y][j] - 1];
  }


  // Check block
  // First, find midpoint of whatever block we're in.
  const rowC = ((Math.floor(i / 3) + 1) * 3) - 2;
  const colC = ((Math.floor(j / 3) + 1) * 3) - 2;

  // Loop from rowCenter-1 to rowCenter+1,
  // then loop from colCenter-1 to colCenter+1.
  const occ = [];
  for (let x = rowC - 1; x <= rowC + 1; ++x) {
    for (let h = colC - 1; h <= colC + 1; ++h) {
      if (board[x][h] !== 0) occ.push(board[x][h]);
    }
  }

  // Add the discovered nums to the total count.
  occ.forEach(h => pos[h - 1]++);

  const ans = [];
  pos.forEach((val, h) => {
    if (val === 0) ans.push(h + 1);
  });

  return ans;
};

/* eslint-disable consistent-return */
// Solve a not fully formed board.
const solve = (board) => {
  // Base case for recurse, check if board is full.
  if (isFull(board)) return true;

  let i = 0;
  let j = 0;

  // Find the first empty spot to pick a number for. Store in i and j.
  for (let x = 0; x < 9; x++) { // Loop through rows
    let flag = false;
    for (let y = 0; y < 9; y++) { // Loop through columns
      // If we found an empty spot, leave loops.
      if (board[x][y] === 0) {
        i = x;
        j = y;
        flag = true;
        break;
      }
    }
    if (flag) break;
  }

  // Now that i and j hold the values of the vacant spot, find a num for it.
  const pos = possibilities(board, i, j);

  // Loop through and follow each possibility branch.
  for (let x = 0; x < pos.length; x++) {
    board[i][j] = pos[x];
    if (solve(board)) return board;
    board[i][j] = 0;
  }
};
/* eslint-enable consistent-return */

// Initliaze a random seed board to solve.
const setup = () => {
  const row = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let col = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Remove the first row item from the col.
  col.splice((row[0] - 1), 1);
  col = shuffle(col);

  while (col[0] === row[1] || col[0] === row[2]) {
    col.push(col[0]);
    col.splice(0, 1);
  }

  while (col[1] === row[1] || col[1] === row[2]) {
    col.push(col[1]);
    col.splice(1, 1);
  }

  const board = Array(Array(9).fill(0));
  for (let i = 0; i < 8; i++) board.push(Array(9).fill(0));
  board[0] = row;

  for (let i = 1; i < 9; i++) board[i][0] = col[i - 1];

  return solve(board);
};

module.exports = {
  isFull,
  setup,
  validate,
  solve,
  removeSpots,
};
