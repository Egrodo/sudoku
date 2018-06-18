import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Block from './Block';

class Row extends Component {
  constructor() {
    super();
    this.state = {
      nums: [],
    };
  }

  componentWillMount() {
    this.setState({ nums: this.props.data });
  }

  render() {
    return (
      <div className="Row" id={this.props.name}>
        {this.state.nums.map((val, i) => (
          <Block
            val={val}
            name={`${this.props.name}-${i}`}
            key={`${this.props.name}-${i}`}
            update={this.props.update}
            solved={this.props.solved}
          />
        ))}
      </div>
    );
  }
}

Row.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  name: PropTypes.string,
  update: PropTypes.func,
  solved: PropTypes.bool,
};

Row.defaultProps = {
  data: [],
  name: null,
  update: (() => console.error('No update function.')),
  solved: false,
};

export default Row;
