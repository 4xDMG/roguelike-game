import React from 'react';
import Potion from '../images/pt1.png';

export default function renderPotion() {
  return <td className="floor"><img src={Potion} className="entity" /></td>;
}
