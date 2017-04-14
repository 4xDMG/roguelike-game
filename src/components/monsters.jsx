import React, { Component } from 'react';

export function Monster() {
  return <td>M</td>;
}

/*export class Monster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      health: 20,
      damage: 8,
      location: props.Location,
    };

    /*this.health = 20;
    this.damage = 8;
    this.x = 0;
    this.y = 0;
  }

  render() {
    return <td>M</td>;
  }
}*/

export function Boss() {
  return <td>B</td>;
}
