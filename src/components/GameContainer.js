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
      confirmNG: false,
      clear: false,
    };

    this.update = this.update.bind(this);
    this.check = this.check.bind(this);
    this.newGame = this.newGame.bind(this);
    this.solve = this.solve.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
    const data = sudoku.removeSpots(sudoku.setup(), 50);
    const orig = data.slice(0);
    // BUG: How the fuck are data and originalData being modified at the same time?
    this.setState({ data, originalData: orig });
  }

  solve() {
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
          message: '',
        });
      }
    }
  }

  newGame(event, diff) {
    // If the user clicks confirm.
    if (this.state.confirmNG) {
      const data = sudoku.removeSpots(sudoku.setup(), diff);
      this.setState({
        data,
        originalData: data,
        solved: false,
        message: '',
        err: false,
        confirmNG: false,
      });
    } else {
      // BUG: Spamming this breaks it.
      this.setState({ confirmNG: true });
      setTimeout(() => {
        this.setState({ confirmNG: false });
      }, 5000);
    }
  }

  clear() {
    if (this.state.clear) {
      /* eslint-disable-next-line */
      const cleared = this.state.data.map((v => v.map(l => 0)));
      this.setState({
        data: cleared,
        message: 'Cleared',
        err: false,
        solved: false,
      });
    } else {
      this.setState({ clear: true });
      setTimeout(() => {
        this.setState({ clear: false });
      }, 5000);
    }
  }

  check() {
    // Loop through data and check if that same spot in originalData is the same value.
  }

  reset() {
    const orig = [...this.state.originalData];
    this.setState({ data: orig });
  }

  update(id, val) {
    // Function called by a block to update global state.
    const [row, col] = id.split('-'); // Retrieve indexes
    const { data } = this.state;
    data[row][col] = val;
    const valid = sudoku.validate(data);
    if (valid === true) {
      this.setState({ data, solved: false, err: false });
    } else this.setState({ err: [valid[0], valid[1]] });
    // BUG: This is working, but it's not sending flash properly.
  }

  render() {
    // TODO: Fix prop drilling with context api.
    // TODO: Replace clear with undo tracking back thru history?
    const {
      solved,
      message,
      err,
      data,
      clear,
      confirmNG,
    } = this.state;

    /* Ternary to sort errors into their respective blocks:
      if err is an array (if there are errors) {
        if both errors exist on the same row {
          send the whole err arr with both errors
        } else if err exists on any given row {
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
          <button onClick={this.newGame} className={confirmNG ? 'timer' : ''}>
            {confirmNG ? 'Confirm?' : 'New Game'}
          </button>
          <button onClick={this.solve}>
            Solve
          </button>
          <button onClick={this.reset} className={clear ? 'timer' : ''}>
            {clear ? 'Confirm?' : '! Reset Game'}
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
