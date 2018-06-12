import React, { Component } from 'react';
import Block from './Block';
import '../css/GameContainer.css';

class GameContainer extends Component {
  constructor() {
    super();
    this.state = {
      blocks: ['A1', 'B1', 'C1', 'A2', 'B2', 'C2', 'A3', 'B3', 'C3'],
    };
  }

  render() {
    // On submit, traverse through each row and column and ensure they have 1-9.
    return (
      <div className="GameContainer">
        { this.state.blocks.map(name => <Block key={name} name={name} />) }
      </div>
    );
  }
}

export default GameContainer;
