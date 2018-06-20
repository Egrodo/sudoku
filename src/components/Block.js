import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/Block.css';

class Block extends Component {
  constructor() {
    super();
    this.state = {
      val: '',
      change: false,
    };

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.flash = this.flash.bind(this);
  }

  componentWillMount() {
    this.setState({ val: this.props.val, change: this.props.err });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.val !== this.state.val) {
      this.setState({ val: nextProps.val });
      if (nextProps.solved) this.flash();
    } else if (nextProps.err) this.flash();
  }

  onChange(e) {
    let val = String(e.target.value);
    // Handle input parsing. Convert to ints, blanks handled as zeros in code.
    if (val.length > 1) return;
    if (val === '' || val === ' ') val = 0;
    val = parseInt(val, 10);
    if (Number.isNaN(val)) return;
    this.props.update(this.props.name, val);
  }

  onSubmit(e) {
    e.preventDefault();
  }

  onClick(e) {
    e.target.select();
  }

  onBlur(e) {
    e.currentTarget.blur();
  }

  flash() {
    this.setState({ change: true });
    setTimeout(() => {
      this.setState({ change: false });
    }, 1000);
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
            onBlur={this.onBlur}
            type="tel"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="off"
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
  err: PropTypes.bool,
};

Block.defaultProps = {
  val: 0,
  name: 'NONE',
  update: (() => { throw new Error('No update func passed to block'); }),
  solved: false,
  err: false,
};

export default Block;
