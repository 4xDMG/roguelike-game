import React, { PropTypes } from 'react';
import _ from 'lodash';

/* Count the number of generations to determine rule
   set of automata. */
let generations = 0;

/* Uses cellular automata rules to generate a new
   map with a more 'natural' appearance */
function generateNewMap(oldMap) {
  const newMap = [];

  oldMap.forEach((rowArr, rowIndex) => {
    newMap.push([]);

    const priorRow = oldMap.slice(rowIndex - 1, rowIndex);
    const laterRow = oldMap.slice(rowIndex + 1, rowIndex + 2);

    rowArr.forEach((tile, tileIndex) => {
      let neighbourCount = 0;

      const priorTile = tileIndex - 1;
      const laterTile = tileIndex + 1;

      /* Check if priorRow is a valid array and
         count tiles neighbours. If the tile is
         at the edge of the map force it to become
         a wall. */
      if (Array.isArray(priorRow[0])) {
        if (priorRow[0][priorTile] === '#') neighbourCount += 1;
        if (priorRow[0][tileIndex] === '#') neighbourCount += 1;
        if (priorRow[0][laterTile] === '#') neighbourCount += 1;
      } else {
        neighbourCount += 5;
      }

      // Check if previous tile on same row is inside array
      if (priorTile >= 0) {
        if (rowArr[priorTile] === '#') neighbourCount += 1;
      } else {
        neighbourCount += 5;
      }

      // Check if later tile on same row is inside array
      if (laterTile < rowArr.length) {
        if (rowArr[laterTile] === '#') neighbourCount += 1;
      } else {
        neighbourCount += 5;
      }

      // Check if laterRow is valid.
      if (Array.isArray(laterRow[0])) {
        if (laterRow[0][priorTile] === '#') neighbourCount += 1;
        if (laterRow[0][tileIndex] === '#') neighbourCount += 1;
        if (laterRow[0][laterTile] === '#') neighbourCount += 1;
      } else {
        neighbourCount += 5;
      }

      /* Determine if tile becomes a wall or floor
         There must be 5 walls within each 9 tile
         square for it to become a wall. */
      if (tile === '#') {
        /* Use this rule set for the first four generations
           to make a map without large open spaces */
        if (generations <= 4) {
          if (neighbourCount >= 4 || neighbourCount <= 2) {
            newMap[rowIndex].push('#');
          } else {
            newMap[rowIndex].push('.');
          }
        } else {
          /* Use this rule set to smooth out map and remove
             isolated single walls. */
          if (neighbourCount >= 4) {
            newMap[rowIndex].push('#');
          } else {
            newMap[rowIndex].push('.');
          }
        }
      } else if (neighbourCount >= 5) {
        newMap[rowIndex].push('#');
      } else {
        newMap[rowIndex].push('.');
      }
    });
  });

  generations += 1;
  return newMap;
}

/* Compares maps and recursively generates a new one
   if they are not equal. */
function normalizeMapArr(oldMap, newMap) {
  /* Check if map has finished generating and return
     the finsihed map. */
  if (_.isEqual(oldMap, newMap)) {
    return newMap;
  }
  // Reassign maps.
  const tempOldMap = newMap;
  const tempNewMap = generateNewMap(newMap);
  return normalizeMapArr(tempOldMap, tempNewMap);
}

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
  const gameMap = normalizeMapArr([], props.mapArr);
  return (
    <table>
      <tbody>
        {gameMap.map(element => generateMapRow(element))}
      </tbody>
    </table>
  );
}

GameMap.propTypes = {
  mapArr: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};
