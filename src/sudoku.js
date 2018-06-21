// const generate = () => [
//   [0, 0, 0, 2, 0, 4, 8, 1, 0],
//   [0, 4, 0, 0, 0, 8, 2, 6, 3],
//   [3, 0, 0, 1, 6, 0, 0, 0, 4],
//   [1, 0, 0, 0, 4, 0, 5, 8, 0],
//   [6, 3, 5, 8, 2, 0, 0, 0, 7],
//   [2, 0, 0, 5, 9, 0, 1, 0, 0],
//   [9, 1, 0, 7, 0, 0, 0, 4, 0],
//   [0, 0, 0, 6, 8, 0, 0, 2, 0],
//   [8, 0, 0, 4, 0, 3, 7, 5, 9],
// ];

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

const generate = () => {
  const row = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Generate random first row.
  let col = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  col.splice((row[0] - 1), 1);
  col = shuffle(col);

  // Col starts at row[1]
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
  return board;
};

const isFull = (board) => {
  for (let i = 0; i < 9; i++) {
    for (let n = 0; n < 9; n++) {
      if (board[i][n] === 0) return false;
    }
  }
  return true;
};


const validate = (board) => {
  // Accepts a full or unfinished board and returns
  // either true (indicating valid) or an array of
  // the offenders.

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

// Generate array of possibilities for given point.
const possibilities = (board, i, j) => {
  if (i > 8 || i < 0 || j > 8 || j < 0) throw new Error('Invalid coords.');
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

module.exports = {
  isFull,
  generate,
  validate,
  solve,
};
