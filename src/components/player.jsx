import React, { Component } from 'react';

export default class Player extends Component {
  constructor() {
    super();

    this.state = {
      level: 1,
      health: 100,
      weapon: 'empty',
    };
  }

  render() {
    return <td>@</td>;
  }

}
