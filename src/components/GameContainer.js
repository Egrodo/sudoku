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
    };
    // Have flag for making message good or bad.
    this.validate = this.validate.bind(this);
    this.update = this.update.bind(this);
    this.reset = this.reset.bind(this);
    this.solve = this.solve.bind(this);
  }

  componentWillMount() {
    this.setState({ data: sudoku.generate() });
  }

  solve() {
    // Solve needs to validate that it's solvable before solving.
    // Check if already solved before modifing.
    if (this.state.solved) {
      this.setState({ message: 'Already solved.' });
      return;
    }
    const valid = sudoku.validate(this.state.data);
    if (valid !== true) {
      // Flash red on the block and on conflicting block.
      this.setState({ message: `Conflict with ${valid[0]} and ${valid[1]}.` });
      return;
    }

    const solved = sudoku.solve(this.state.data);
    if (!Array.isArray(solved)) {
      // If failed to solve.
      this.setState({ message: 'Cannot solve' });
    } else this.setState({ data: solved, solved: true, message: '' });
  }

  reset() {
    const data = sudoku.generate();
    this.setState({ data, solved: false, message: '' });
  }

  validate() {
    if (!sudoku.isFull(this.state.data)) {
      this.setState({ message: 'Missing spots' });
    } else {
      const valid = sudoku.validate(this.state.data);
      if (valid !== true) {
        this.setState({ message: `Conflict with ${valid[0]} and ${valid[1]}.` });
      } else this.setState({ message: 'Valid' });
    }
  }

  update(id, val) {
    // Function to update the game state from any individual block.
    const [row, col] = id.split('-'); // Retrieve indexes
    const { data } = this.state;
    data[row][col] = val;
    this.setState({ data, modified: true, solved: false }, console.log(this.state.data));
  }

  render() {
    // TODO: Fix prop drilling with context api.
    return (
      <Fragment>

        <div className="GameContainer">
          {this.state.data.map((row, i) => (
            <Row
              data={row}
              name={i.toString()}
              key={i}
              update={this.update}
              solved={this.state.solved}
            />
          ))}
        </div>

        <div className="ui">
          <button onClick={this.reset}>
            Reset
          </button>
          <button onClick={this.solve}>
            Solve
          </button>
          <button onClick={this.validate}>
            Validate
          </button>
          <h4 className="message">
            {this.state.message ? this.state.message : ''}
          </h4>
        </div>
      </Fragment>
    );
  }
}

export default GameContainer;
