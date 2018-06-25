import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/UserInterface.css';

class UserInterface extends Component {
  constructor() {
    super();

    this.state = { diff: false };
    this.timer = null;
    this.diffToggle = this.diffToggle.bind(this);
  }

  componentWillMount() {
    this.setState({ diff: this.props.diff });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ diff: nextProps.diff });
  }

  componentDidUpdate() {
    // If someone clicks newGame again less than 3 seconds after just chosing one, clear timer.
    if (!this.state.diff) clearTimeout(this.timer);
  }

  diffToggle() {
    if (!this.state.diff) {
      this.setState({ diff: true });
      this.timer = setTimeout(() => { this.setState({ diff: false }); }, 3000);
    } else {
      alert("Shouldn't get here, diffToggle.");
    }
  }

  render() {
    // TODO: Better way of doing conditional return?
    // TODO: CSS timer
    const { methods } = this.props;
    if (this.state.diff) {
      return (
        <div className="ui">
          <button onClick={() => methods.newGame(null, 20)} className="timer">
            Easy
          </button>
          <button onClick={() => methods.newGame(null, 40)} className="timer">
            Medium
          </button>
          <button onClick={() => methods.newGame(null, 50)} className="timer">
            Hard
          </button>
          <button onClick={() => methods.newGame(null, 64)} className="timer">
            Impossible
          </button>
          <h4 className={`message ${this.props.err ? 'err' : ''}`}>
            {this.props.message || ''}
          </h4>
        </div>
      );
    }

    return (
      <div className="ui">
        <button onClick={this.diffToggle}>
          New Game
        </button>
        <button onClick={methods.submit}>
          Submit
        </button>
        <button onClick={methods.reset}>
          Reset
        </button>
        <button onClick={methods.solve}>
          Solve
        </button>
        <h4 className={`message ${this.props.err ? 'err' : ''}`}>
          {this.props.message || ''}
        </h4>
      </div>
    );
  }
}

UserInterface.propTypes = {
  message: PropTypes.string,
  diff: PropTypes.bool,
  err: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  methods: PropTypes.objectOf(PropTypes.func),
};

UserInterface.defaultProps = {
  message: '',
  diff: false,
  err: false,
  methods: (() => { throw new ReferenceError('Method obj not passed to UI.'); }),
};

export default UserInterface;
