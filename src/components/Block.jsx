import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SubBlock from './SubBlock';

class Block extends Component {
  constructor() {
    super();
    this.state = {
      blocks: {
        A1: 1, B1: 2, C1: 3, A2: 4, B2: 5, C2: 6, A3: 7, B3: 8, C3: 9,
      },
    };
  }

  // Each block is made up out of 9 SubBlocks.
  render() {
    return (
      <div className={`block ${this.props.name}`}>
        { Object.keys(this.state.blocks).map(name => (
          <SubBlock key={name} name={name} value={this.state.blocks[name]} />
        ))}
      </div>
    );
  }
}

Block.propTypes = {
  name: PropTypes.string,
};

Block.defaultProps = {
  name: 'Unspecified',
};

export default Block;
