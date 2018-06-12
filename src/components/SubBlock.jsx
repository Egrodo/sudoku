import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/SubBlock.css';

class SubBlock extends Component {
  constructor() {
    super();
    this.state = {
      val: Number,
      disabled: false,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    console.log(this.props);
    this.setState({ val: this.props.value });
  }

  onChange(e) {
    if (e.target.value.length > 1) return;
    this.setState({ val: e.target.value });
  }

  render() {
    // NOTE: Change 'type' to number when done.

    return (
      <div className={`SubBlock ${this.props.name}`}>
        <form>
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

SubBlock.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
};

SubBlock.defaultProps = {
  name: 'Unspecified',
  value: 0,
};

export default SubBlock;
