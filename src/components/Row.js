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
      solved,
    } = this.props;

    /* If err is a 2d array {
        if err[0][1] === i or if err[1][1] === i {
          send true
        }
      } else if not a 2d array {
        if err[1] === i send true
      }

      err ? (
              err[0][1] === i ?
                err[0] : (err[1] ?
                  err[1] : false)
            ) : false
    */
    return (
      <div className="Row" id={name}>
        {this.state.nums.map((val, i) => (
          <Block
            val={val}
            name={`${name}-${i}`}
            key={`${name}-${i}`}
            err={
              err ? err[0].constructor === Array ? (
                err[0][1] === i || err[1][1] === i
              ) : (err[1] === i) : false
            }
            update={update}
            solved={solved}
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
  /* eslint-disable-next-line */
  err: PropTypes.array,
};

Row.defaultProps = {
  data: [],
  name: null,
  update: (() => { throw new Error('No update function.'); }),
  solved: false,
  err: [false],
};

export default Row;
