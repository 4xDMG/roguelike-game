import React, { Component } from 'react';
import _ from 'lodash';
import BuildGameMap from './generateGameMap';
import Player from './player';
import { placePlayer, placeEntity, placeMonster, placeBoss } from './placeGameEntities';
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
      monsters: [],
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

    const monsters = [];
    for (let i = 0; i < 5; i += 1) {
      const location = placeMonster(gameMapArr, mapDimensions, '.');
      const monster = new Monster(location);
      monsters.push(monster);
    }

    this.setState({ monsters });
    this.setState({ bossPos: placeBoss(gameMapArr, mapDimensions, '.') });
  }

  handlePlayerMove(event) {
    event.preventDefault();

    const playerX = this.state.playerPos.x;
    const playerY = this.state.playerPos.y;

    switch (event.key) {
      case 'w':
      case 'ArrowUp':
        if (this.handleEntityCollision({ x: playerX - 1, y: playerY })) break;
        if (this.checkPlayerMove('x', 'up')) this.setState({ playerPos: { x: playerX - 1, y: playerY } });
        break;
      case 's':
      case 'ArrowDown':
        if (this.handleEntityCollision({ x: playerX + 1, y: playerY })) break;
        if (this.checkPlayerMove('x', 'down')) this.setState({ playerPos: { x: playerX + 1, y: playerY } });
        break;
      case 'a':
      case 'ArrowLeft':
        if (this.handleEntityCollision({ x: playerX, y: playerY - 1 })) break;
        if (this.checkPlayerMove('y', 'left')) this.setState({ playerPos: { x: playerX, y: playerY - 1 } });
        break;
      case 'd':
      case 'ArrowRight':
        if (this.handleEntityCollision({ x: playerX, y: playerY + 1 })) break;
        if (this.checkPlayerMove('y', 'right')) this.setState({ playerPos: { x: playerX, y: playerY + 1 } });
        break;
      default:
        break;
    }
    this.forceUpdate();
  }

  handleEntityCollision(newPlayerPos) {
    const monsters = this.state.monsters;
    let monsterIndex = 0;
    const isMonster = monsters.some((currentMonster, index) => {
      monsterIndex = index;
      if (_.isEqual(currentMonster.location, newPlayerPos)) {

        return true;
      }
      return false;
    });

    if (isMonster) {
      const playerDamage = this.player.handleAttack();
      const monsterDamage = monsters[monsterIndex].handleAttack();
      monsters[monsterIndex].handleDefence(playerDamage);
      this.player.handleDefence(monsterDamage);
      return true;
    }

    return false;
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
    const monsters = this.state.monsters;

    return (
      <table tabIndex="1" onKeyDown={this.handlePlayerMove}>
        <tbody>
          {this.state.gameMap.map((rowArr, rowIndex) =>
            <tr key={`row${rowIndex}`}>
              {rowArr.map((tile, tileIndex) => {
                const currentPos = { x: rowIndex, y: tileIndex };
                let monsterIndex = 0;
                if (this.state.playerPos.x === rowIndex && this.state.playerPos.y === tileIndex) {
                  return (
                    <Player
                      key="player"
                      ref={(player) => { this.player = player; }}
                    />);
                } else if (_.find(potionPos, currentPos)) {
                  return <Potion key={`Potion${tileIndex}`} />;
                } else if (this.state.bossPos.x === rowIndex && this.state.bossPos.y === tileIndex) {
                  return <Boss key="boss" />;
                } else if (monsters.some((currentMonster, index) => {
                  monsterIndex = index;
                  return _.isEqual(currentMonster.location, currentPos);
                })) {
                  console.log(monsters[monsterIndex]);
                  return monsters[monsterIndex].render();
                }

                return <td key={`tile${tileIndex}`}>{tile}</td>;
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
