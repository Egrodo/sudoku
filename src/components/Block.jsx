import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Block extends Component {
  constructor() {
    super();
    this.state = { val: '' };
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.setState({ val: this.props.val });
  }

  async onChange(e) {
    // Keep val a string until updating globally.
    let val = e.target.value;

    // Ensure the input field contains only a single number.
    if (val.length > 1) return;
    if (val !== '' && Number.isNaN(parseInt(val, 10))) return;
    await this.setState({ val });
    this.props.update(this.props.name, parseInt(this.state.val, 10));
  }

  onSubmit(e) {
    e.preventDefault();
  }

  // Each block is made up out of 9 SubBlocks.
  render() {
    // TODO: Switch to type: number.
    return (
      <div className="Block" id={this.props.name}>
        <form onSubmit={this.onSubmit}>
          <input
            value={this.state.val}
            onChange={this.onChange}
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
