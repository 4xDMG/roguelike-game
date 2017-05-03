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
      mapDimensions: props.MapDimensions,
      gameMap: [],
      player: {
        location: {
          x: 0,
          y: 0,
        },
        health: 100,
        level: 1,
        xp: 0,
        weapon: {
          type: 'empty',
          damage: 4,
        },
      },
      playerHealth: 100,
      playerPos: {},
      potionPos: [],
      monsters: [],
      bossPos: {},
    };

    this.handlePlayerMove = this.handlePlayerMove.bind(this);
    this.getTileType = this.getTileType.bind(this);
  }

  componentWillMount() {
    const mapDimensions = this.state.mapDimensions;
    const gameMapArr = BuildGameMap(mapDimensions);

    this.setState({ gameMap: gameMapArr });

    const player = this.state.player;
    player.location = placePlayer(gameMapArr, 0, 0, '.');
    this.setState({ player });

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

    const player = this.state.player;
    const playerX = this.state.player.location.x;
    const playerY = this.state.player.location.y;

    switch (event.key) {
      case 'w':
      case 'ArrowUp':
        if (this.handleEntityCollision({ x: playerX - 1, y: playerY })) {
          break;
        }
        if (this.checkPlayerMove('x', 'up')) {
          player.location.x = playerX - 1;
          player.location.y = playerY;
          this.setState({ player });
        }
        break;
      case 's':
      case 'ArrowDown':
        if (this.handleEntityCollision({ x: playerX + 1, y: playerY })) {
          break;
        }
        if (this.checkPlayerMove('x', 'down')) {
          player.location.x = playerX + 1;
          player.location.y = playerY;
          this.setState({ player });
        }
        break;
      case 'a':
      case 'ArrowLeft':
        if (this.handleEntityCollision({ x: playerX, y: playerY - 1 })) {
          break;
        }
        if (this.checkPlayerMove('y', 'left')) {
          player.location.x = playerX;
          player.location.y = playerY - 1;
          this.setState({ player });
        }
        break;
      case 'd':
      case 'ArrowRight':
        if (this.handleEntityCollision({ x: playerX, y: playerY + 1 })) {
          break;
        }
        if (this.checkPlayerMove('y', 'right')) {
          player.location.x = playerX;
          player.location.y = playerY + 1;
          this.setState({ player });
        }
        break;
      default:
        break;
    }
  }

  handleEntityCollision(newPlayerPos) {
    const monsters = this.state.monsters;
    const potions = this.state.potionPos;
    let monsterIndex = NaN;
    const isMonster = monsters.some((currentMonster, index) => {
      if (_.isEqual(currentMonster.location, newPlayerPos)) {
        monsterIndex = index;
        return true;
      }
      return false;
    });

    if (isMonster && monsters[monsterIndex].isAlive()) {
      const playerDamage = this.player.handleAttack();
      const monsterDamage = monsters[monsterIndex].handleAttack();

      monsters[monsterIndex].handleDefence(playerDamage);
      this.setState({ playerHealth: this.state.playerHealth - monsterDamage });
      if (!this.player.isAlive()) {
        alert('you lose!');
      }
      if (!monsters[monsterIndex].isAlive()) {
        this.player.handleLevelUp(200);
      }

      return true;
    }

    let potionIndex = NaN;
    const isPotion = potions.some((currentPotion, index) => {
      if (_.isEqual(currentPotion, newPlayerPos)) {
        potionIndex = index;
        return true;
      }
    });

    if (isPotion) {
      const playerHealth = this.state.playerHealth;
      const potionPos = this.state.potionPos;
      potionPos.splice(potionIndex, 1);
      if (playerHealth + 20 > 100) {
        this.setState({ playerHealth: 100 });
      } else {
        this.setState({ playerHealth: playerHealth + 20 });
      }
      this.setState({ potionPos });
    }

    return false;
  }

  checkPlayerMove(axis, direction) {
    const gameMap = this.state.gameMap;
    const playerX = this.state.player.location.x;
    const playerY = this.state.player.location.y;

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

  getViewBoundary(player, mapDimensions, viewSize) {
    const mapBoundaries = {};
    mapBoundaries.top = player.x - viewSize;
    mapBoundaries.left = player.y - viewSize;
    mapBoundaries.bottom = player.x + viewSize;
    mapBoundaries.right = player.y + viewSize;

    if (mapBoundaries.top < 0) {
      const excessBoundaryTop = Math.abs(mapBoundaries.top);
      mapBoundaries.top = 0;
      mapBoundaries.bottom = mapBoundaries.bottom + excessBoundaryTop;
    }

    if (mapBoundaries.left < 0) {
      const excessBoundaryLeft = Math.abs(mapBoundaries.left);
      mapBoundaries.left = 0;
      mapBoundaries.right = mapBoundaries.right + excessBoundaryLeft;
    }

    if (mapBoundaries.bottom >= mapDimensions.x) {
      const excessBoundaryBottom = mapBoundaries.bottom - mapDimensions.x;
      mapBoundaries.bottom = mapDimensions.x - 1;
      mapDimensions.top = mapDimensions.top - excessBoundaryBottom;
    }

    if (mapBoundaries.right >= mapDimensions.y) {
      const excessBoundaryRight = mapBoundaries.right - mapDimensions.y;
      mapBoundaries.right = mapDimensions.right - 1;
      mapBoundaries.left = mapBoundaries.left - excessBoundaryRight;
    }
    return mapBoundaries;
  }

  getTileType(rowIndex, tileIndex, tile) {
    const playerPos = this.state.player.location;
    const potionPos = this.state.potionPos;
    const monsters = this.state.monsters;
    const currentPos = { x: rowIndex, y: tileIndex };
    let monsterIndex = 0;

    if (playerPos.x === rowIndex && playerPos.y === tileIndex) {
      return (
        <Player
          key="player"
          ref={(player) => { this.player = player; }}
          Health={this.state.playerHealth}
        />);
    } else if (_.find(potionPos, currentPos)) {
      return <Potion key={`Potion${tileIndex}`} />;
    } else if (this.state.bossPos.x === rowIndex && this.state.bossPos.y === tileIndex) {
      return <Boss key="boss" />;
    } else if (monsters.some((currentMonster, index) => {
      monsterIndex = index;
      return _.isEqual(currentMonster.location, currentPos);
    })) {
      return monsters[monsterIndex].render();
    }

    return <td key={`tile${tileIndex}`}>{tile}</td>;
  }

  render() {
    const playerPos = this.state.player.location;
    const viewBoundary = this.getViewBoundary(playerPos, this.state.mapDimensions, 10);

    return (
      <table tabIndex="1" onKeyDown={this.handlePlayerMove}>
        <tbody>
          {this.state.gameMap.map((rowArr, rowIndex) => {
            if (rowIndex >= viewBoundary.top && rowIndex <= viewBoundary.bottom) {
              return (
                <tr key={`row${rowIndex}`}>
                  {rowArr.map((tile, tileIndex) => {
                    if (tileIndex >= viewBoundary.left && tileIndex <= viewBoundary.right){
                      return this.getTileType(rowIndex, tileIndex, tile);
                    }
                  })
                  }
                </tr>
              );
            }
          })
          }

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
