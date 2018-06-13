import React, { Component } from 'react';
import Row from './Row';
import '../css/GameContainer.css';

class GameContainer extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    /*
      [
        [
          1, 4, 8, 0, 2, 5, 3, 9, 7, 6
        ]
        [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 0
        ]
        [
          etc...
        ]
      ]
    */

    this.update = this.update.bind(this);
  }

  componentWillMount() {
    // Generate dummy data in correct format to pass down.
    const data = [];
    for (let i = 1; i <= 9; ++i) data.push([...Array(9).keys()]);
    this.setState({ data });
  }

  update(id, val) {
    const [row, col] = id.split('-');
    // Now we have a row and column, modify state.
    const { data } = this.state;
    data[row][col] = val;
    this.setState({ data });
  }

  render() {
    // TODO: Fix update func prop drilling with context api.
    return (
      <div className="GameContainer">
        {this.state.data.map((row, i) => <Row data={row} name={i} update={this.update}/>)}
      </div>
    );
  }
}

export default GameContainer;
