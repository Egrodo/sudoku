const generate = () => [
  [0, 0, 0, 2, 0, 4, 8, 1, 0],
  [0, 4, 0, 0, 0, 8, 2, 6, 3],
  [3, 0, 0, 1, 6, 0, 0, 0, 4],
  [1, 0, 0, 0, 4, 0, 5, 8, 0],
  [6, 3, 5, 8, 2, 0, 0, 0, 7],
  [2, 0, 0, 5, 9, 0, 1, 0, 0],
  [9, 1, 0, 7, 0, 0, 0, 4, 0],
  [0, 0, 0, 6, 8, 0, 0, 2, 0],
  [8, 0, 0, 4, 0, 3, 7, 5, 9],
];


const isFull = (board) => {
  for (let i = 0; i < 9; i++) {
    for (let n = 0; n < 9; n++) {
      if (board[i][n] === 0) return false;
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
  generate,
  solve,
};
