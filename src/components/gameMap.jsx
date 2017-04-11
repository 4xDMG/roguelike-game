import React, { Component } from 'react';
import BuildGameMap from './generateGameMap';
import Player from './player';

export default class GameMap extends Component {
  constructor() {
    super();

    this.state = {
      gameMap: [],
      playerPos: { x: 10, y: 10 },
    };

    this.handlePlayerMove = this.handlePlayerMove.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
  }

  componentWillMount() {
    this.setState({ gameMap: BuildGameMap() });
  }

  handlePlayerMove(event) {
    event.preventDefault();

    const playerX = this.state.playerPos.x;
    const playerY = this.state.playerPos.y;

    switch (event.key) {
      case 'w':
      case 'ArrowUp':
        this.setState({ playerPos: { x: playerX - 1, y: playerY } });
        break;
      case 's':
      case 'ArrowDown':
        this.setState({ playerPos: { x: playerX + 1, y: playerY } });
        break;
      case 'a':
      case 'ArrowLeft':
        this.setState({ playerPos: { x: playerX, y: playerY - 1 } });
        break;
      case 'd':
      case 'ArrowRight':
        this.setState({ playerPos: { x: playerX, y: playerY + 1 } });
        break;
      default:
        break;
    }
    console.log(this.state.playerPos);
    this.forceUpdate();
  }

  render() {
    return (
      <table tabIndex="1" onKeyDown={this.handlePlayerMove}>
        <tbody>
          {this.state.gameMap.map((rowArr, rowIndex) =>
            <tr>
              {rowArr.map((tile, tileIndex) => {
                if (this.state.playerPos.x === rowIndex && this.state.playerPos.y === tileIndex) {
                  return <Player />;
                }
                return <td>{tile}</td>;
              },
              )}
            </tr>)}
        </tbody>
      </table>
    );
  }
}
