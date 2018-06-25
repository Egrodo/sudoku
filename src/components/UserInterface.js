import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/UserInterface.css';

class UserInterface extends Component {
  constructor() {
    super();

    this.state = { diff: false, reset: false };
    this.diffTimer = null;
    this.resetTimer = null;

    this.diffToggle = this.diffToggle.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
    this.setState({ diff: this.props.diff });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ diff: nextProps.diff });
  }

  componentDidUpdate() {
    // If someone clicks the button again less than 3 seconds after a clear is needed.
    if (!this.state.diff) clearTimeout(this.diffTimer);
    if (!this.state.reset) clearTimeout(this.resetTimer);
  }

  // Toggle to difficulty selection so long as we're not already there.
  diffToggle() {
    if (this.state.diff) return;
    this.setState({ diff: true });
    this.diffTimer = setTimeout(() => { this.setState({ diff: false }); }, 3000);
  }

  reset() {
    if (this.state.reset) {
      this.setState({ reset: false });
      this.props.methods.reset();
    } else {
      this.setState({ reset: true });
      this.resetTimer = setTimeout(() => { this.setState({ reset: false }); }, 3000);
    }
  }

  render() {
    const { methods } = this.props;
    if (this.state.diff) {
      return (
        <div className="ui">
          <button onClick={() => methods.newGame(null, 20)} >
            Easy
          </button>
          <button onClick={() => methods.newGame(null, 40)}>
            Medium
          </button>
          <button onClick={() => methods.newGame(null, 50)} >
            Hard
          </button>
          <button onClick={() => methods.newGame(null, 64)} >
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
        <button onClick={this.reset}>
          {this.state.reset ? 'Are you sure?' : 'Reset'}
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
