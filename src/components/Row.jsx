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
            update={this.props.update}
          />
        ))}
      </div>
    );
  }
}

Row.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  name: PropTypes.number,
  update: PropTypes.func,
};

Row.defaultProps = {
  data: [],
  name: null,
  update: (() => console.error('no update func passed.')),
};

export default Row;
