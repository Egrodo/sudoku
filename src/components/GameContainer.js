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

    this.update = this.update.bind(this);
    this.solve = this.solve.bind(this);
  }

  componentWillMount() {
    this.setState({ data: sudoku.generate() });
  }

  solve() {
    // Check if already solved before modifing.
    // TODO: If modified, disabvle solved.
    if (this.state.solved) return;
    const solved = sudoku.solve(this.state.data);
    if (!Array.isArray(solved)) {
      // If failed to solve.
      this.setState({ message: 'Cannot solve' });
    } else this.setState({ data: solved, solved: true, message: '' });
  }

  update(id, val) {
    // Function to update the game state from any individual block.
    const [row, col] = id.split('-'); // Retrieve indexes
    const { data } = this.state;
    data[row][col] = val;
    this.setState({ data, solved: false });
  }

  render() {
    // TODO: Fix update function prop drilling with context api.
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

        <div className="control">
          <button onClick={this.solve}>
            Solve
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
