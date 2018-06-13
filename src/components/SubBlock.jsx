import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../Provider';
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
    this.setState({ val: this.props.value });
  }

  onChange(e) {
    if (e.target.value.length > 1) return;
    this.setState({ val: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
  }
  
  render() {
    // NOTE: Change 'type' to number when done.

    return (
      <Context.Consumer>
        {context => (
          <div className={`SubBlock ${this.props.name}`}>
            <form onSubmit={this.onSubmit}>
              <input
                // value={this.state.val}
                onChange={context.update}
                type="text"
                disabled={this.state.disabled}
                maxLength="1"
              />
            </form>
          </div>
        )}
      </Context.Consumer>
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
