import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SubBlock from './SubBlock';

class Block extends Component {
  constructor() {
    super();
    this.state = {
      blocks: ['A1', 'B1', 'C1', 'A2', 'B2', 'C2', 'A3', 'B3', 'C3'],
    };
  }
  render() {
    return (
      <div className={`block ${this.props.name}`}>
        { this.state.blocks.map(name => <SubBlock key={name} name={name} />) }
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
