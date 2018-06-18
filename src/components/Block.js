/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Block extends Component {
  constructor() {
    super();
    this.state = {
      val: '',
      change: false,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.setState({ val: this.props.val });
  }

  componentWillReceiveProps(nextProps) {
    // Update animation
    if (nextProps.val !== this.state.val) {
      this.setState({ val: nextProps.val, change: true });
    }
  }

  onChange(e) {
    const val = e.target.value;

    // Ensure the input field contains only a single number.
    if (val.length > 1) return;
    if (val !== '' && Number.isNaN(parseInt(val, 10))) return;
    this.setState({ val });
    this.props.update(this.props.name, parseInt(val, 10));
  }

  onSubmit(e) {
    e.preventDefault();
  }

  onClick(e) {
    e.target.select();
  }

  render() {
    return (
      <div className={`Block ${this.state.change ? 'change' : ''}`} id={this.props.name}>
        <form onSubmit={this.onSubmit}>
          <input
            value={this.state.val}
            onChange={this.onChange}
            onClick={this.onClick}
            type="text"
            disabled={this.state.disabled}
            maxLength="1"
          />
        </form>
      </div>
    );
  }
}

Block.propTypes = {
  val: PropTypes.number,
  name: PropTypes.string,
  update: PropTypes.func,
};

Block.defaultProps = {
  val: 0,
  name: 'NONE',
  update: (() => console.error('no update func passed.')),
};

export default Block;
