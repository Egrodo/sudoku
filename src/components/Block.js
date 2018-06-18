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
    // TODO: only add change if solved.
    if (nextProps.val !== this.state.val) {
      this.setState({ val: nextProps.val });
      console.log(nextProps.solved);
      if (!nextProps.solved) this.setState({ change: true });
    }
  }

  onChange(e) {
    let val = e.target.value;
    // Ensure the input field contains only a single number.
    if (val.length > 1) return;
    if (val === '' || val === ' ') val = 0;
    val = parseInt(val, 10);
    if (Number.isNaN(val)) return;
    this.props.update(this.props.name, parseInt(val, 10));
  }

  onSubmit(e) {
    e.preventDefault();
  }

  onClick(e) {
    e.target.select();
  }

  render() {
    const { change, val, disabled } = this.state;
    return (
      <div className={`Block ${change ? 'change' : ''}`} id={this.props.name}>
        <form onSubmit={this.onSubmit}>
          <input
            value={val === 0 ? '' : val}
            onChange={this.onChange}
            onClick={this.onClick}
            type="text"
            disabled={disabled}
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
  solved: PropTypes.bool,
};

Block.defaultProps = {
  val: 0,
  name: 'NONE',
  update: (() => console.error('no update func passed.')),
  solved: false,
};

export default Block;
