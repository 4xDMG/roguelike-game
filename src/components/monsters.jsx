import React, { Component } from 'react';
import Boss1 from '../images/monsters/boss/boss1.png';
import Monster1Lvl1 from '../images/monsters/monsters-level-1/monster-lvl1-1.png';

export class Monster extends Component {
  constructor(location, level) {
    super();

    this.level = level;
    this.health = level * 20;
    this.damage = 8;
    this.location = location;
    this.image = Monster1Lvl1;

    this.handleAttack = this.handleAttack.bind(this);
    this.handleDefence = this.handleDefence.bind(this);
  }

  handleAttack() {
    const damage = this.damage;
    const attackDamage = Math.round(Math.random() * damage) + this.level;

    return attackDamage;
  }

  handleDefence(damage) {
    this.health = this.health - damage;
  }

  isAlive() {
    if (this.health > 0) {
      return true;
    }
    return false;
  }

  render() {
    if (this.health > 0) {
      return (
        <td className="floor">
          <img src={Monster1Lvl1} className="entity" alt="" />
        </td>
      );
    }
    return <td className="floor" />;
  }
}

export function Boss() {
  return (
    <td className="floor">
      <img src={Boss1} className="entity" alt="" />
    </td>
  );
}
