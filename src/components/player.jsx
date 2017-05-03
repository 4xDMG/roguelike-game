import React, { Component } from 'react';

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.handleAttack = this.handleAttack.bind(this);
  }

  handleLevelUp(xp) {
    const currentLvl = this.state.level;
    const currentXp = this.state.xp + xp;
    console.log(currentXp);
    this.setState({ xp: currentXp });

    if (currentXp > (200 * currentLvl)) {
      this.setState({ level: currentLvl + 1 });
      alert("Level Up: " + currentLvl);
    }
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
