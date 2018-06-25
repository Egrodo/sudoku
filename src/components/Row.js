import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Block from './Block';
import '../css/Row.css';

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

  componentWillReceiveProps(nextProps) {
    this.setState({ nums: nextProps.data });
  }

  render() {
    const {
      name,
      err,
      update,
      flash,
    } = this.props;

    /*
      If err is a 2d array {
        if err[0][1] === i or if err[1][1] === i {
          send true
        }
      } else if not a 2d array {
        if err[1] === i send true
      }
    */

    return (
      <div className="Row" id={name}>
        {this.state.nums.map((val, i) => (
          <Block
            val={val}
            name={`${name}-${i}`}
            key={`${name}-${i}`}
            flash={flash}
            err={
              err ? err[0].constructor === Array ? (
                err[0][1] === i || err[1][1] === i
              ) : (err[1] === i) : false
            }
            update={update}
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
  flash: PropTypes.bool,
  err: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
};

Row.defaultProps = {
  data: [],
  name: null,
  update: (() => { throw new ReferenceError('No update function.'); }),
  flash: false,
  err: [false],
};

export default Row;
