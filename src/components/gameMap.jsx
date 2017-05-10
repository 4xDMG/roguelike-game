import React, { Component } from 'react';
import _ from 'lodash';
import MapGenerator from './generateGameMap';
import Player from './player';
import { placePlayer, placeEntity, placeMonster, placeBoss } from './placeGameEntities';
import Potion from './items';
import { Monster, Boss } from './monsters';
import PlayerInfo from './playerInfo';
import heroFrontStill from '../images/hero/hero-front-still.png';
import heroRightStill from '../images/hero/hero-right-still.png';
import heroLeftStill from '../images/hero/hero-left-still.png';
import heroBackStill from '../images/hero/hero-back-still.png';
import officeScissors from '../images/weapons/office-scissors.png';
import rustyShears from '../images/weapons/rusty-shears.png';
import badassScissors from '../images/weapons/badass-scissors.png';
import wallBottom from '../images/tiles/wall-bottom.png';
import wallLeft from '../images/tiles/wall-left.png';
import wallRight from '../images/tiles/wall-right.png';
import wallTop from '../images/tiles/wall-top.png';
import wallTextureTop from '../images/tiles/wall-texture-top.png';
import cornerTopLeft from '../images/tiles/corner-top-left.png';
import cornerTopRight from '../images/tiles/corner-top-right.png';
import cornerBottomLeft from '../images/tiles/corner-bottom-left.png';
import cornerBottomRight from '../images/tiles/corner-bottom-right.png';

export default class GameMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapDimensions: props.MapDimensions,
      currentLevel: 0,
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
        image: heroFrontStill,
      },
      potionPos: [],
      monsters: [],
      boss: {},
      weapons: [
        {
          type: 'office scissors',
          damage: 8,
          location: {
            x: 0,
            y: 0,
          },
          image: officeScissors,
        },
        {
          type: 'rusty shears',
          damage: 12,
          location: {
            x: 0,
            y: 0,
          },
          image: rustyShears,
        },
        {
          type: 'badass scissors',
          damage: 15,
          location: {
            x: 0,
            y: 0,
          },
          image: badassScissors,
        },
      ],
    };

    this.handlePlayerMove = this.handlePlayerMove.bind(this);
    this.getTileType = this.getTileType.bind(this);
  }

  componentWillMount() {
    // Build a new Map.
    const mapDimensions = this.state.mapDimensions;
    const gameMapArr = MapGenerator.BuildGameMap(mapDimensions);
    const currentLevel = this.state.currentLevel;
    this.setState({ currentLevel: currentLevel + 1 });

    this.setState({ gameMap: gameMapArr });

    // Initialize starting positions for entities.
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
      const monster = new Monster(location, currentLevel + 1);
      monsters.push(monster);
    }

    this.setState({ monsters });

    const weapons = this.state.weapons;
    weapons[currentLevel].location = placeEntity(gameMapArr, mapDimensions, '.');
    this.setState({ weapons });

    const bossLoc = placeBoss(gameMapArr, mapDimensions, '.');
    const boss = new Monster(bossLoc, currentLevel + 2);
    this.setState({ boss });

    document.addEventListener('keydown', this.handlePlayerMove);
  }

  handlePlayerMove(event) {
    event.preventDefault();

    const player = this.state.player;
    const playerX = this.state.player.location.x;
    const playerY = this.state.player.location.y;
    // Check tile that player wants to move to and move Player
    switch (event.key) {
      case 'w':
      case 'ArrowUp':
        if (this.handleEntityCollision({ x: playerX - 1, y: playerY })) {
          break;
        }
        if (this.checkPlayerMove('x', 'up')) {
          player.location.x = playerX - 1;
          player.location.y = playerY;
          player.image = heroBackStill;
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
          player.image = heroFrontStill;
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
          player.image = heroLeftStill;
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
          player.image = heroRightStill;
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

    // Check if tile contains a monster.
    let monsterIndex = NaN;
    const isMonster = monsters.some((currentMonster, index) => {
      if (_.isEqual(currentMonster.location, newPlayerPos)) {
        monsterIndex = index;
        return true;
      }
      return false;
    });

    // If tile contains a monster handle combat.
    if (isMonster && monsters[monsterIndex].isAlive()) {
      const player = this.state.player;
      const playerDamage = Player.handleAttack(player.weapon.damage, player.level);
      const monsterDamage = monsters[monsterIndex].handleAttack();

      monsters[monsterIndex].handleDefence(playerDamage);
      player.health -= monsterDamage;
      // Check if Player survived combat.
      if (!Player.isAlive(player.health)) {
        alert('you lose!');
      }
      // If Player defeated Monster give Player xp.
      if (!monsters[monsterIndex].isAlive()) {
        const newXp = Player.handleXp(player.xp, player.level, 200);
        if (newXp.Lvl) {
          player.level = newXp.Lvl;
        }
        player.xp = newXp.xp;
      }

      this.setState({ player });
      return true;
    }

    let potionIndex = NaN;
    const isPotion = potions.some((currentPotion, index) => {
      if (_.isEqual(currentPotion, newPlayerPos)) {
        potionIndex = index;
        return true;
      }
      return false;
    });

    if (isPotion) {
      const player = this.state.player;
      const potionPos = this.state.potionPos;
      potionPos.splice(potionIndex, 1);
      if ((player.health + 20) >= 100) {
        player.health = 100;
        this.setState({ player });
      } else {
        player.health += 20;
        this.setState({ player });
      }
      this.setState({ potionPos });
    }

    const weapon = this.state.weapons[this.state.currentLevel - 1];
    if (_.isEqual(newPlayerPos, weapon.location)) {
      const player = this.state.player;
      player.weapon = weapon;
      weapon.location = { x: -1, y: -1 };
      this.setState({ player });
      this.setState({ weapon });
    }

    const boss = this.state.boss;
    if (_.isEqual(newPlayerPos, boss.location)) {
      const player = this.state.player;
      const playerDamage = Player.handleAttack(player.weapon.damage, player.level);
      const bossDamage = boss.handleAttack();

      boss.handleDefence(playerDamage);
      player.health -= bossDamage;
      // Check if Player survived combat.
      if (!Player.isAlive(player.health)) {
        alert('you lose!');
      }
      // If Player defeated Monster give Player xp.
      if (!boss.isAlive()) {
        const newXp = Player.handleXp(player.xp, player.level, 200);
        if (newXp.Lvl) {
          player.level = newXp.Lvl;
        }
        player.xp = newXp.xp;
        boss.location = 0;
      }

      this.setState({ boss });
      this.setState({ player });
      return true;
    }

    return false;
  }

  // Check if tile to move to is a wall.
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

  // Gets a portion of the map to display.
  getViewBoundary(player, mapDimensions, viewSize) {
    const mapBoundaries = {};
    mapBoundaries.top = player.x - viewSize;
    mapBoundaries.left = player.y - viewSize;
    mapBoundaries.bottom = player.x + viewSize;
    mapBoundaries.right = player.y + viewSize;

    if (mapBoundaries.top < 0) {
      const excessBoundaryTop = Math.abs(mapBoundaries.top);
      mapBoundaries.top = 0;
      mapBoundaries.bottom += excessBoundaryTop;
    }

    if (mapBoundaries.left < 0) {
      const excessBoundaryLeft = Math.abs(mapBoundaries.left);
      mapBoundaries.left = 0;
      mapBoundaries.right += excessBoundaryLeft;
    }

    if (mapBoundaries.bottom >= mapDimensions.height) {
      const excessBoundaryBottom = Math.abs(mapBoundaries.bottom - mapDimensions.height);
      mapBoundaries.bottom = mapDimensions.height - 1;
      mapBoundaries.top -= excessBoundaryBottom + 1;
    }

    if (mapBoundaries.right >= mapDimensions.width) {
      const excessBoundaryRight = Math.abs(mapBoundaries.right - mapDimensions.width);
      mapBoundaries.right = mapDimensions.width - 1;
      mapBoundaries.left -= excessBoundaryRight + 1;
    }

    return mapBoundaries;
  }


  getTileType(rowIndex, tileIndex, tile, gameMap) {
    const playerPos = this.state.player.location;
    const potionPos = this.state.potionPos;
    const monsters = this.state.monsters;
    const boss = this.state.boss;
    const weapon = this.state.weapons[this.state.currentLevel - 1];
    const currentPos = { x: rowIndex, y: tileIndex };
    let monsterIndex = 0;

    if (_.isEqual(playerPos, currentPos)) {
      return <td className="floor"><img src={this.state.player.image} className="entity" /></td>;
    } else if (_.find(potionPos, currentPos)) {
      return <Potion key={`Potion${tileIndex}`} />;
    } else if (_.isEqual(boss.location, currentPos)) {
      return <Boss key="boss" />;
    } else if (monsters.some((currentMonster, index) => {
      monsterIndex = index;
      return _.isEqual(currentMonster.location, currentPos);
    })) {
      return monsters[monsterIndex].render();
    } else if (_.isEqual(weapon.location, currentPos)) {
      return <td className="floor"><img src={weapon.image} className="entity" /></td>;
    } else if (tile === '#') {
      const wallImages = [];

      // Handles pseudo-3D wall tile for top edges of floor space.
      if (Array.isArray(gameMap[rowIndex + 1])) {
        if (gameMap[rowIndex + 1][tileIndex] === '.') {
          wallImages.push(wallTextureTop);
        }
      }

      // Handles top wall borders
      if (Array.isArray(gameMap[rowIndex + 2])) {
        if (gameMap[rowIndex + 2][tileIndex] === '.' && gameMap[rowIndex + 1][tileIndex] === '#') {
          wallImages.push(wallTop);
        }

        if (gameMap[rowIndex][tileIndex + 1]) {
          if (gameMap[rowIndex + 1][tileIndex + 1] === '.' && gameMap[rowIndex + 1][tileIndex] === '#') {
            wallImages.push(wallLeft);
          }

          if (gameMap[rowIndex + 2][tileIndex] === '#') {
            if (gameMap[rowIndex + 2][tileIndex + 1] === '.' && gameMap[rowIndex + 1][tileIndex + 1] === '#') {
              wallImages.push(cornerTopLeft);
            }
          }
        }

        if (gameMap[rowIndex][tileIndex - 1]) {
          if (gameMap[rowIndex + 1][tileIndex - 1] === '.' && gameMap[rowIndex + 1][tileIndex] === '#') {
            wallImages.push(wallRight);
          }

          if (gameMap[rowIndex + 2][tileIndex] === '#') {
            if (gameMap[rowIndex + 2][tileIndex - 1] === '.' && gameMap[rowIndex + 1][tileIndex - 1] === '#') {
              wallImages.push(cornerTopRight);
            }
          }
        }
      }

      // Handles bottom wall borders.
      if (Array.isArray(gameMap[rowIndex - 1])) {
        if (gameMap[rowIndex - 1][tileIndex] === '.') {
          wallImages.push(wallBottom);
        }

        if (gameMap[rowIndex][tileIndex + 1]) {
          if (gameMap[rowIndex - 1][tileIndex + 1] === '.' && gameMap[rowIndex][tileIndex + 1] === '.') {
            if (Array.isArray(gameMap[rowIndex + 1]) && gameMap[rowIndex + 1][tileIndex] === '#') {
              wallImages.push(wallLeft);
            }
          }

          if (gameMap[rowIndex - 1][tileIndex] === '#') {
            if (gameMap[rowIndex][tileIndex + 1] === '#' && gameMap[rowIndex - 1][tileIndex + 1] === '.') {
              wallImages.push(cornerBottomLeft);
            }
          }
        }

        if (gameMap[rowIndex][tileIndex - 1]) {
          if (gameMap[rowIndex - 1][tileIndex - 1] === '.' && gameMap[rowIndex][tileIndex - 1] === '.') {
            if (Array.isArray(gameMap[rowIndex + 1]) && gameMap[rowIndex + 1][tileIndex] === '#') {
              wallImages.push(wallRight);
            }
          }

          if (gameMap[rowIndex - 1][tileIndex] === '#') {
            if (gameMap[rowIndex][tileIndex - 1] === '#' && gameMap[rowIndex - 1][tileIndex - 1] === '.') {
              wallImages.push(cornerBottomRight);
            }
          }
        }
      }

      const wallImgStyle = {
        position: 'absolute',
        top: '0px',
        left: '0px',
        height: 60,
        width: 60,
      };

      return (
        <td>
          <div className="wall">
            {wallImages.map(wallImg => <img style={wallImgStyle} src={wallImg} />)}
          </div>
        </td>);
    }

    return <td className="floor" key={`tile${tileIndex}`} />;
  }

  render() {
    const playerPos = this.state.player.location;
    const viewBoundary = this.getViewBoundary(playerPos, this.state.mapDimensions, 5);

    return (
      <div>
        <table>
          <tbody>
            {this.state.gameMap.map((rowArr, rowIndex, gameMap) => {
              if (rowIndex >= viewBoundary.top && rowIndex <= viewBoundary.bottom) {
                return (
                  <tr key={`row${rowIndex}`}>
                    {rowArr.map((tile, tileIndex) => {
                      if (tileIndex >= viewBoundary.left && tileIndex <= viewBoundary.right){
                        return this.getTileType(rowIndex, tileIndex, tile, gameMap);
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
        <PlayerInfo
          Health={this.state.player.health}
          Level={this.state.player.level}
          Weapon={this.state.player.weapon.type}
        />
      </div>
    );
  }
}

GameMap.propTypes = {
  MapDimensions: React.PropTypes.shape({
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
  }).isRequired,
};
