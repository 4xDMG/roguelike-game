import React from 'react';

export default function PlayerInfo(props) {
  const healthStyle = { width: `${props.Health}%` };

  const weaponStyle = { height: '30px', width: 'auto' }
  return (
    <div className="player-info">
      <div className="progress">
        <div
          className="progress-bar progress-bar-danger"
          role="progressbar"
          aria-valuenow={props.Health}
          aria-valuemin="0"
          aria-valuemax="100"
          style={healthStyle}
        >
          <p>{props.Health}%</p>
        </div>
      </div>
      <p>Level: {props.Level}</p>
      <img src={props.Weapon.image} style={weaponStyle} />
      <p>{props.Weapon.type}</p>
    </div>
  )
}