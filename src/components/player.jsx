import React, { Component } from 'react';

/*export default class Player extends Component {
  constructor(props) {
    super(props);

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

}*/

const Player = {
  handleAttack(damage, level) {
    const attackDamage = Math.round((Math.random() * damage) + 1);
    return attackDamage;
  },
  handleXp(currentXp, currentLvl, xpEarnt) {
    const newXp = currentXp + xpEarnt;
    const nextLvl = 200 * currentLvl;
    if (newXp >= nextLvl) {
      return { xp: newXp, Lvl: currentLvl + 1 };
    }
    return { xp: newXp };
  },
  isAlive(health) {
    if (health > 0) {
      return true;
    }
    return false;
  }
}

export default Player;
