import React, { Fragment, Component } from 'react';
import Row from './Row';
import UserInterface from './UserInterface';
import sudoku from '../sudoku';
import '../css/GameContainer.css';

class GameContainer extends Component {
  // TODO: sessionStorage
  constructor() {
    super();
    this.state = {
      data: [],
      originalData: [],
      solved: false,
      message: '',
      flash: false,
      err: false,
      diff: false,
    };

    this.newGame = this.newGame.bind(this);
    this.update = this.update.bind(this);
    this.submit = this.submit.bind(this);
    this.solve = this.solve.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
    const data = sudoku.removeSpots(sudoku.setup(), 20);
    // Since we have a 2d array we need to deep copy by slicing the result of a map.
    this.setState({ data, originalData: data.map(v => v.slice(0)) });
  }

  // Attempt to solve current board.
  solve() {
    if (this.state.solved) {
      this.setState({ message: 'Already solved.', err: true });
      return;
    }

    // First validate data to ensure its solvable.
    const valid = sudoku.validate(this.state.data);
    if (valid !== true) {
      this.setState({
        message: `Conflict with ${valid[0]} and ${valid[1]}.`,
        err: valid,
      });
    } else {
      const solved = sudoku.solve(this.state.data);
      if (!Array.isArray(solved)) {
        if (solved === true) {
          this.setState({ solved: true });
        } else {
          // This will be hit when puzzle is 'valid' but still not solvable.
          this.setState({ message: 'Unsolvable', err: true });
        }
      } else {
        this.setState({
          data: solved,
          solved: true,
          message: 'Solved',
          flash: true,
          err: false,
        });
      }
    }
  }

  // Generate new game.
  newGame(e, diff) {
    const data = sudoku.removeSpots(sudoku.setup(), diff);
    this.setState({
      data,
      originalData: data.map(v => v.slice(0)),
      solved: false,
      flash: false,
      message: '',
      err: false,
    });
  }

  // Check current game against correct solution.
  submit() {
    if (this.state.err) {
      if (this.state.err === true) return;
      this.setState({ message: `Conflict with ${this.state.err[0]} and ${this.state.err[1]}.` });
      return;
    }
    if (this.state.solved) {
      this.setState({ message: 'Already solved.' });
      return;
    }
    const data = this.state.data.map(v => v.slice(0));
    const solved = sudoku.solve(this.state.originalData.map(v => v.slice(0)));

    let flag = true;
    for (let i = 0; i < 9; ++i) {
      for (let n = 0; n < 9; ++n) {
        if (data[i][n] === 0) {
          // If we find a zero, the puzzle isn't fully solved yet but continue checking.
          flag = false;
          continue;
        }
        if (data[i][n] !== solved[i][n]) {
          this.setState({ message: `[${i}, ${n}] isn't correct`, err: [[i, n], [null, null]] });
          return;
        }
      }
    }
    if (flag) {
      // TODO: Win animaton?
      this.setState({ message: 'Congratulations, you won! Play again?', err: false });
    } else this.setState({ message: 'Correct so far!', err: false });
  }

  // Reset the board to unmodified state.
  reset() {
    const data = this.state.originalData.map(v => v.slice(0));
    this.setState({
      data,
      solved: false,
      err: false,
      message: 'Reset',
    });
  }

  // Function called by block to update global state.
  update(id, val) {
    const [row, col] = id.split('-'); // Retrieve indexes
    const { data } = this.state;
    data[row][col] = val;
    const valid = sudoku.validate(data);
    if (valid === true) {
      this.setState({
        data,
        solved: false,
        message: '',
        err: false,
        flash: false,
      });
    } else {
      this.setState({
        err: [valid[0], valid[1]],
        solved: false,
        message: '',
      });
    }
  }

  render() {
    // TODO: Fix prop drilling with context api.
    const {
      message,
      err,
      data,
      flash,
      diff,
    } = this.state;

    const methods = {
      newGame: this.newGame,
      solve: this.solve,
      reset: this.reset,
      submit: this.submit,
    };

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
              flash={flash}
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
        <UserInterface message={message} diff={diff} err={err} methods={methods} />
      </Fragment>
    );
  }
}

export default GameContainer;
