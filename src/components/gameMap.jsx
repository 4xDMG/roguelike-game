import React, { Component } from 'react';
import BuildGameMap from './generateGameMap';
import Player from './player';
import { placePlayer, placeEntity, placeBoss } from './placeGameEntities';

export default class GameMap extends Component {
  constructor() {
    super();

    this.state = {
      gameMap: [],
      playerPos: {},
      potionPos: [],
      monsterPos: [],
      bossPos: {},
    };

    this.handlePlayerMove = this.handlePlayerMove.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
  }

  componentWillMount() {
    const gameMapArr = BuildGameMap();
    this.setState({ gameMap: gameMapArr });
    this.setState({ playerPos: placePlayer(gameMapArr, 0, 0, '.') });

    const potionPos = [];
    for (let i = 0; i < 4; i += 1) {
      potionPos.push(placeEntity(gameMapArr, 30, 60, '.'));
    }

    this.setState({ potionPos });

    const monsterPos = [];
    for (let i = 0; i < 4; i += 1) {
      monsterPos.push(placeEntity(gameMapArr, 30, 60, '.'));
    }

    this.setState({ monsterPos });

    this.setState({ bossPos: placeBoss(gameMapArr, 29, 59, '.') });
  }

  handlePlayerMove(event) {
    event.preventDefault();

    const playerX = this.state.playerPos.x;
    const playerY = this.state.playerPos.y;

    switch (event.key) {
      case 'w':
      case 'ArrowUp':
        if (this.checkPlayerMove('x', 'up')) this.setState({ playerPos: { x: playerX - 1, y: playerY } });
        break;
      case 's':
      case 'ArrowDown':
        if (this.checkPlayerMove('x', 'down')) this.setState({ playerPos: { x: playerX + 1, y: playerY } });
        break;
      case 'a':
      case 'ArrowLeft':
        if (this.checkPlayerMove('y', 'left')) this.setState({ playerPos: { x: playerX, y: playerY - 1 } });
        break;
      case 'd':
      case 'ArrowRight':
        if (this.checkPlayerMove('y', 'right')) this.setState({ playerPos: { x: playerX, y: playerY + 1 } });
        break;
      default:
        break;
    }
    this.forceUpdate();
  }

  checkPlayerMove(axis, direction) {
    const gameMap = this.state.gameMap;
    const playerX = this.state.playerPos.x;
    const playerY = this.state.playerPos.y;

    if (axis === 'x') {
      if (direction === 'up') {
        if (gameMap[playerX - 1][playerY] === '.') return true;
        return false;
      }
      if (gameMap[playerX + 1][playerY] === '.') return true;
      return false;
    }
    if (direction === 'left') {
      if (gameMap[playerX][playerY - 1] === '.') return true;
      return false;
    }
    if (gameMap[playerX][playerY + 1] === '.') return true;
    return false;
  }

  render() {
    console.log(this.state);
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
