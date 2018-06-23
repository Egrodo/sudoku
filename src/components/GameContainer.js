import React, { Fragment, Component } from 'react';
import Row from './Row';
import sudoku from '../sudoku';
import '../css/GameContainer.css';

class GameContainer extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      originalData: [],
      solved: false,
      message: '',
      err: true,
    };

    this.newGame = this.newGame.bind(this);
    this.update = this.update.bind(this);
    this.check = this.check.bind(this);
    this.solve = this.solve.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
    const data = sudoku.removeSpots(sudoku.setup(), 50);
    /*
      For the unique copy, I realized we didn't need 2 for loops, only one
      because the nums in the second array are immutable. Then once I had it
      working with one for loop, and since I needed to turn the results of the
      operation into a new array, map + slice was obvious.
    */
    this.setState({ data, originalData: data.map(v => v.slice(0)) });
  }

  // Attempt to solve current board.
  solve() {
    // TODO: Keep the block flashing on solve and reset.
    // Check if already solved before modifing.
    if (this.state.solved) {
      this.setState({ message: 'Already solved.', err: true });
      return;
    }

    // Validate existing data to ensure its solvable.
    const valid = sudoku.validate(this.state.data);
    if (valid !== true) {
      this.setState({
        message: `Conflict with ${valid[0]} and ${valid[1]}.`,
        err: [valid[0], valid[1]],
      });
      // ^ Store err coords for visualizer.
    } else {
      const solved = sudoku.solve(this.state.data);
      if (!Array.isArray(solved)) {
        // Will this ever be hit? Validator should cover unsolvable puzzles.
        this.setState({ message: 'Unsolvable', err: true });
      } else {
        this.setState({
          data: solved,
          solved: true,
          message: 'Solved',
          err: false,
        });
      }
    }
  }

  // Generate new game.
  newGame(e, diff) {
    // TODO: Choose difficulty
    const data = sudoku.removeSpots(sudoku.setup(), diff);
    this.setState({
      data,
      originalData: data.map(v => v.slice(0)),
      solved: false,
      message: '',
      err: false,
    });
  }

  // Check current game against correct solution.
  check() {
    // Loop through data and check if that same spot in originalData is the same value.
  }

  // Reset the board to unmodified state.
  reset() {
    const data = this.state.originalData;
    this.setState({
      data: data.map(v => v.slice(0)),
      solved: false,
      err: false,
      message: 'Reset',
    });
  }

  // Function called by a block to update global state.
  update(id, val) {
    const [row, col] = id.split('-'); // Retrieve indexes
    const { data } = this.state;
    data[row][col] = val;
    const valid = sudoku.validate(data);
    if (valid === true) {
      this.setState({ data, solved: false, err: false });
    } else this.setState({ err: [valid[0], valid[1]] });
  }

  render() {
    // TODO: Fix prop drilling with context api.
    const {
      solved,
      message,
      err,
      data,
    } = this.state;

    /*
      Ternary to sort errors into their respective blocks:
        if err is an array (if there are errors) {
          if both errors exist on the same row {
            send the whole err arr with both errors
          } else if the first err exists on any given row {
            send to that row
          } else if the other err exists on the given row {
            send to that row
          }
        }
    */

    return (
      <Fragment>
        <div className="GameContainer">
          {data.map((row, i) => (
            <Row
              data={row}
              name={i.toString()}
              key={i}
              update={this.update}
              solved={solved}
              err={
                Array.isArray(err) ? (
                  err[0][0] === i && err[1][0] === i ? err : (
                    err[0][0] === i ? err[0] : (
                      err[1][0] === i ? err[1] : false
                    )
                  )
                ) : false
              }
            />
          ))}
        </div>

        <div className="ui">
          <button onClick={this.newGame}>
            New Game
          </button>
          <button onClick={this.solve}>
            Solve
          </button>
          <button onClick={this.reset}>
            Reset Game
          </button>
          <button onClick={this.check}>
            ! Check
          </button>
          <h4 className={`message ${err ? 'err' : ''}`}>
            {message || ''}
          </h4>
        </div>
      </Fragment>
    );
  }
}

export default GameContainer;
