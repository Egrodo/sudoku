import React, { Fragment, Component } from 'react';
import Row from './Row';
import sudoku from '../sudoku';
import '../css/GameContainer.css';

class GameContainer extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      solved: false,
      message: '',
      err: true,
      reset: false,
      clear: false,
    };

    this.validate = this.validate.bind(this);
    this.update = this.update.bind(this);
    this.reset = this.reset.bind(this);
    this.solve = this.solve.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentWillMount() {
    const data = sudoku.solve(sudoku.generate());
    this.setState({ data });
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

  reset() {
    if (this.state.reset) {
      let diff = 32;
      const data = sudoku.createDifficulty(sudoku.solve(sudoku.generate()), diff);
      this.setState({
        diff,
        data,
        solved: false,
        message: '',
        err: false,
        reset: false,
      });
    } else {
      this.setState({ reset: true });
      setTimeout(() => {
        this.setState({ reset: false });
      }, 5000);
    }
  }

  validate() {
    // TODO: Validate is fucked.
    const valid = sudoku.validate(this.state.data);
    if (valid !== true) {
      this.setState({
        message: `Conflict with ${valid[0]} and ${valid[1]}.`,
        err: [valid[0], valid[1]],
      });
    } else this.setState({ message: 'Valid', err: false });
  }

  clear() {
    if (this.state.clear) {
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

  update(id, val) {
    // Function called by a block to update global state.
    // TODO: Validate on keypress.
    const [row, col] = id.split('-'); // Retrieve indexes
    const { data } = this.state;
    data[row][col] = val;
    this.setState({ data, solved: false, err: false });
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
      reset,
    } = this.state;

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
                Array.isArray(err) && (
                  err[0][0] === i ||
                  err[1][0] === i
                ) ? err : false
              }
            />
          ))}
        </div>

        <div className="ui">
          <button onClick={this.reset} className={reset ? 'timer' : ''}>
            {reset ? 'Confirm?' : 'New Puzzle'}
          </button>
          <button onClick={this.solve}>
            Solve
          </button>
          <button onClick={this.clear} className={clear ? 'timer' : ''}>
            {clear ? 'Confirm?' : 'Clear Board'}
          </button>
          <button onClick={this.validate}>
            Validate
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
