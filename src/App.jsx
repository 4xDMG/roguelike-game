import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GameMap from './components/gameMap';

class App extends Component {
  constructor() {
    super();

    this.state = { height: 60, width: 60 };
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div>
          <GameMap MapDimensions={this.state} />
        </div>
      </div>
    );
  }
}

export default App;
