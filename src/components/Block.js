import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/Block.css';

class Block extends Component {
  constructor() {
    super();
    this.state = {
      val: '',
      solid: false,
      flash: false,
    };

    this.flash = this.flash.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.setState({ val: this.props.val });
  }

  componentWillReceiveProps(nextProps) {
    // BUG: The flash messes up sometimes due to settimeout.
    // If click solve then change num before animation is over.
    if (nextProps.val !== this.state.val) {
      this.setState({ val: nextProps.val });
      if (nextProps.flash) this.flash();
    }

    if (nextProps.err) {
      this.setState({ solid: true });
    } else this.setState({ solid: false });
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
    e.currentTarget.firstChild.firstChild.select();
  }

  onBlur(e) {
    e.target.blur();
  }

  flash() {
    this.setState({ flash: true });
    setTimeout(() => {
      this.setState({ flash: false });
    }, 1000);
  }

  render() {
    const {
      val,
      solid,
      flash,
    } = this.state;

    return (
      <div
        className={`Block ${flash ? 'flash' : ''}${solid ? 'solid' : ''}`}
        id={this.props.name}
        onClick={this.onClick}
        role="presentation"
      >
        <form onSubmit={this.onSubmit}>
          <input
            value={val === 0 ? '' : val}
            onChange={this.onChange}
            onBlur={this.onBlur}
            type="tel"
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
  flash: PropTypes.bool,
  err: PropTypes.bool,
};

Block.defaultProps = {
  val: 0,
  name: 'NONE',
  update: (() => { throw new ReferenceError('No update func passed to block'); }),
  flash: false,
  err: false,
};

export default Block;
