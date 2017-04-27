import React, { Component } from 'react';

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      level: 1,
      health: props.Health,
      weapon: { type: 'empty', damage: 4 },
    };

    this.handleAttack = this.handleAttack.bind(this);
    this.handleDefence = this.handleDefence.bind(this);
  }

  handleAttack() {
    const damage = this.state.weapon.damage;
    const level = this.state.level;
    const attackDamage = Math.round((Math.random() * damage) + level);
    return attackDamage;
  }

  handleDefence(damage) {
    this.setState({ health: this.state.health - damage });
  }

  render() {
    console.log('player health: ' + this.state.health);
    return <td>@</td>;
  }

}
