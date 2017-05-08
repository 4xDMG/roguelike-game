import _ from 'lodash';

const MapGenerator = (function generateMapAPI() {
  /* Uses cellular automata rules to generate a new
   map with a more 'natural' appearance */
  function generateNewMap(oldMap, generations) {
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
              newMap[rowIndex].push('F');
            }
          } else if (neighbourCount >= 4) {
            /* Use this rule set to smooth out map and remove
               isolated single walls. */

            newMap[rowIndex].push('#');
          } else {
            newMap[rowIndex].push('F');
          }
        } else if (neighbourCount >= 5) {
          newMap[rowIndex].push('#');
        } else {
          newMap[rowIndex].push('F');
        }
      });
    });

    return newMap;
  }

  /* Compares maps and recursively generates a new one
     if they are not equal. */
  function normalizeMapArr(oldMap, newMap, generations) {
    /* Check if map has finished generating and return
       the finsihed map. */
    if (_.isEqual(oldMap, newMap)) {
      return newMap;
    }
    // Reassign maps.
    const tempOldMap = newMap;
    const tempNewMap = generateNewMap(newMap, generations);
    return normalizeMapArr(tempOldMap, tempNewMap, generations + 1);
  }

  function getRandomCoords(mapDimensions, gameMap) {
    const randomCoords = {};
    randomCoords.x = Math.floor(Math.random() * mapDimensions.height);
    randomCoords.y = Math.floor(Math.random() * mapDimensions.width);

    if (gameMap[randomCoords.x][randomCoords.y] === '#') {
      getRandomCoords(mapDimensions, gameMap);
    }

    return randomCoords;
  }

  function floodFill(gameMap, x, y) {
    if (gameMap[x][y] === 'F') {
      gameMap[x][y] = '.';
      floodFill(gameMap, x + 1, y);
      floodFill(gameMap, x - 1, y);
      floodFill(gameMap, x, y + 1);
      floodFill(gameMap, x, y - 1);
    }
  }

  function checkMapSize(gameMap) {
    let count = 0;
    gameMap.forEach((row, x) => {
      row.forEach((tile, y) => {
        if (tile === '.') {
          count += 1;
        } else {
          gameMap[x][y] = '#';
        }
      });
    });
    return count;
  }

  function generateMapSeed(height, width) {
    const mapArray = [];

    for (let i = 0; i < height; i += 1) {
      mapArray.push([]);
      for (let j = 0; j < width; j += 1) {
        if (Math.random() < 0.45) {
          mapArray[i].push('#');
        } else {
          mapArray[i].push('F');
        }
      }
    }

    return mapArray;
  }

  return {
    BuildGameMap: function buildGameMap(mapDimensions) {
      const minSize = Math.floor(mapDimensions.height * mapDimensions.width * 0.45);
      const mapSeed = generateMapSeed(mapDimensions.height, mapDimensions.width);
      const gameMap = normalizeMapArr([], mapSeed, 0);
      const randomCoords = getRandomCoords(mapDimensions, gameMap);
      floodFill(gameMap, randomCoords.x, randomCoords.y);
      const mapSize = checkMapSize(gameMap);

      if (mapSize < minSize) {
        return buildGameMap(mapDimensions);
      }

      return gameMap;
    },
  };
}());


export default MapGenerator;
