import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import generateMap from './components/generateMap';
import GameMap from './components/gameMap';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { };
  }

  componentWillMount() {
    const mapArr = generateMap(20, 40);
    this.setState({ mapArr });
  }

  render() {

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div>
          <GameMap
            mapArr={this.state.mapArr}
          />
        </div>
      </div>
    );
  }
}

export default App;
