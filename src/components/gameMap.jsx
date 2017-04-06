import React, { PropTypes } from 'react';

function generateMapTile(tile) {
  return <td>{tile}</td>;
}

function generateMapRow(rowArr) {
  return (
    <tr>
      {rowArr.map(element => generateMapTile(element))}
    </tr>
  );
}

export default function GameMap(props) {
  return (
    <table>
      <tbody>
        {props.mapArr.map(element => generateMapRow(element))}
      </tbody>
    </table>
  );
}

GameMap.propTypes = {
  mapArr: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};
