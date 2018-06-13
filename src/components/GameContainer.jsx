import React, { Component } from 'react';
import Block from './Block';
import Provider from '../Provider';
import '../css/GameContainer.css';

class GameContainer extends Component {
  constructor() {
    super();
    this.state = {
      blocks: ['A1', 'B1', 'C1', 'A2', 'B2', 'C2', 'A3', 'B3', 'C3'],
      data: [],
    };
    /*

      Ideal data would look like:
      [ GameContainer
        [ Block with all 9 SubBlock values in one array.
          1, 4, 8, 0, 2, 5, 3, 9, 7, 6
        ]
        [ Block 2
          1, 2, 3, 4, 5, 6, 7, 8, 9, 0
        ]
        [ 3...
          etc...
        ]
      ]

      Each block pushes a new array onto the state with all its values.
    */

    this.update = this.update.bind(this);
  }

  // Setup a context *provider* and define the data I want to store here.
  // Use a context *consumer* wherever I need that data (block, SubBlock)
  update(e) {
    e.preventDefault();
    console.log('updating global state');
  }

  render() {
    return (
      <Provider>
        <div className="GameContainer">
          {this.state.blocks.map(name => <Block key={name} name={name} />)}
        </div>
      </Provider>
    );
  }
}

export default GameContainer;
