import React, { Component } from 'react';
import _ from 'lodash';
import BuildGameMap from './generateGameMap';
import Player from './player';
import { placePlayer, placeEntity, placeBoss } from './placeGameEntities';
import Potion from './items';
import { Monster, Boss } from './monsters';

export default class GameMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapDimensions: this.props.MapDimensions,
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
    const mapDimensions = this.state.mapDimensions;
    const gameMapArr = BuildGameMap(mapDimensions);

    this.setState({ gameMap: gameMapArr });
    this.setState({ playerPos: placePlayer(gameMapArr, 0, 0, '.') });

    const potionPos = [];
    for (let i = 0; i < 4; i += 1) {
      potionPos.push(placeEntity(gameMapArr, mapDimensions, '.'));
    }

    this.setState({ potionPos });

    const monsterPos = [];
    for (let i = 0; i < 5; i += 1) {
      monsterPos.push(placeEntity(gameMapArr, mapDimensions, '.'));
    }

    this.setState({ monsterPos });

    this.setState({ bossPos: placeBoss(gameMapArr, mapDimensions, '.') });

    console.log(this.state);
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
    const potionPos = this.state.potionPos;
    const monsterPos = this.state.monsterPos;
    return (
      <table tabIndex="1" onKeyDown={this.handlePlayerMove}>
        <tbody>
          {this.state.gameMap.map((rowArr, rowIndex) =>
            <tr>
              {rowArr.map((tile, tileIndex) => {
                const currentPos = { x: rowIndex, y: tileIndex };
                if (this.state.playerPos.x === rowIndex && this.state.playerPos.y === tileIndex) {
                  return <Player />;
                } else if (_.find(potionPos, currentPos)) {
                  return <Potion />;
                } else if (_.find(monsterPos, currentPos)) {
                  return <Monster />;
                } else if (this.state.bossPos.x === rowIndex && this.state.bossPos.y === tileIndex) {
                  return <Boss />;
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

GameMap.propTypes = {
  MapDimensions: React.PropTypes.shape({
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
  }).isRequired,
};
