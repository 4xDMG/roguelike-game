import React, { Component } from 'react';

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      level: 1,
      weapon: { type: 'empty', damage: 4 },
    };

    this.handleAttack = this.handleAttack.bind(this);
  }

  handleAttack() {
    const damage = this.state.weapon.damage;
    const level = this.state.level;
    const attackDamage = Math.round((Math.random() * damage) + level);
    return attackDamage;
  }

  isAlive() {
    if (this.props.Health > 0) {
      return true;
    }
    return false;
  }

  render() {
    return <td>@</td>;
  }

}
