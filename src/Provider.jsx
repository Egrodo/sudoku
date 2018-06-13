import React from 'react';

export const Context = React.createContext();

class AppProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0,
    };

    this.update = (e) => {
      console.log('updating');
      this.setState({ val: e.target.value });
    };
  }

  render() {
    return (
      <Context.Provider value={this.update}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default AppProvider;
