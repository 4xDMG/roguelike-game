import React from 'react';

export default function PlayerInfo(props) {
  return (
    <div>
      <p>Health: {props.Health}</p>
      <p>Level: {props.Level}</p>
      <p>Weapon: {props.Weapon}</p>
    </div>
  )
}