import React, { Component } from 'react';

export class Monster extends Component {
  constructor(location) {
    super();

    this.health = 20;
    this.damage = 8;
    this.location = location;

    this.handleAttack = this.handleAttack.bind(this);
    this.handleDefence = this.handleDefence.bind(this);
  }

  handleAttack() {
    const damage = this.damage;
    const attackDamage = Math.round(Math.random() * damage) + 1;

    return attackDamage;
  }

  handleDefence(damage) {
    this.health = this.health - damage;
    console.log('monster heath: ' + this.health);
  }

  isAlive() {
    if (this.health > 0) {
      return true;
    }
    return false;
  }

  render() {
    if (this.health > 0) {
      return <td>M</td>;
    }
    return <td>.</td>;
  }
}

export function Boss() {
  return <td>B</td>;
}
