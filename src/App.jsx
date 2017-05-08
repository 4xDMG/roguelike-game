import React, { Component } from 'react';
import './App.css';
import GameMap from './components/gameMap';

class App extends Component {
  constructor() {
    super();

    this.state = {
      mapDimensions: {
        height: 60,
        width: 60,
      },
    };
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Scissor Warrior</h2>
        </div>
        <div>
          <GameMap
            MapDimensions={this.state.mapDimensions}
          />
        </div>
      </div>
    );
  }
}

export default App;
