import React, { Component } from 'react';

/*export function Monster() {
  return <td>M</td>;
}*/

export class Monster extends Component {
  constructor(location) {
    super();

    /*this.state = {
      health: 20,
      damage: 8,
      location,
    };*/

    this.health = 20;
    this.damage = 8;
    this.location = location;

    this.handleAttack = this.handleAttack.bind(this);
    this.handleDefence = this.handleDefence.bind(this);
  }

  componentDidMount() {
    console.log('mounted');
  }

  handleAttack() {
    const damage = this.damage;
    const attackDamage = Math.round(Math.random() * damage);
    console.log(attackDamage);
    return attackDamage;
  }

  handleDefence(damage) {
    //this.setState({ health: this.state.health - damage });
    this.health = this.health - damage;
  }

  render() {
    console.log('monster health: ' + this.health);
    return <td>M</td>;
  }
}

export function Boss() {
  return <td>B</td>;
}
