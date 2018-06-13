import React, { Component } from 'react';

const myContext = React.createContext();

class Provider extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    // Generate dummy data in correct format to pass down.
    const data = [];
    for (let i = 1; i <= 9; ++i) data.push([...Array(9).keys()]);
    this.setState({ data });
  }

  update(id, val) {
    // Function to update the game state from any individual block.

    const [row, col] = id.split('-'); // Retrieve indexes
    const { data } = this.state;
    data[row][col] = val;
    this.setState({ data });
  }

  render() {
    console.log('rendering provider');
    return (
      <myContext.Provider value={{
        state: this.state,
        update: this.update,
      }}
      >
        {this.props.children}
      </myContext.Provider>
    );
  }
}

export default Provider;
