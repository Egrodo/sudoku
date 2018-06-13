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
      GameContainer renders 9 rows, each of which
      contain 9 individual blocks to make 9 rows.
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

  componentDidMount() {
    const genRow = () => {
      const row = [];
      while (row.length !== 9) {
        let rand = Math.floor(Math.random() * Math.floor(9));
        rand++;
        if (!row.includes(rand)) row.push(rand);
      }
      return row;
    };

    const data = [genRow()];

    while (data.length !== 9) { // Loop through all 9 rows
      const randRow = genRow();
      let flag = false;
      // For each upper row, check if there are conflicts.
      for (let i = data.length - 1; i >= 0; --i) { // Loop up to check
        if (flag) break;
        for (let n = 0; n < randRow.length; ++n) {
          if (flag) break;
          if (randRow[n] === data[i][n]) flag = true;
        }
      }
      if (!flag) data.push(randRow);
    }

    console.log(data);
    this.setState({ data });
  }

  update(id, val) {
    // Function to update the game state from any individual block.

    const [row, col] = id.split('-'); // Retrieve indexes
    const { data } = this.state;
    data[row][col] = val;
    this.setState({ data });
  }

  render() {
    // TODO: Fix update function prop drilling with context api.

    return (
      <div className="GameContainer">
        {this.state.data.map((row, i) => (
          <Row data={row} name={i.toString()} key={i} update={this.update} />
        ))}
      </div>
    );
  }
}

export default GameContainer;
