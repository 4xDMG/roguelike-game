import React, { Component } from 'react';

export function Monster() {
  return <td>M</td>;
}

/* export class Monster extends Component {
  constructor(x, y) {
    super();

    this.health = 20;
    this.damage = 8;
    this.x = x;
    this.y = y;
  }

  render() {
    return <td>M</td>;
  }
} */

export function Boss() {
  return <td>B</td>;
}
