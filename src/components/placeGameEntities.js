export function placePlayer(arr, x, y, tile) {
  if (arr[x][y] === tile) return { x, y };

  return placePlayer(arr, x + 1, y + 1, tile);
}

export function placeEntity(arr, mapDimensions, tile) {
  const x = Math.floor(Math.random() * mapDimensions.height);
  const y = Math.floor(Math.random() * mapDimensions.width);

  if (arr[x][y] === tile) return { x, y };

  return placeEntity(arr, mapDimensions, tile);
}

export function placeMonster(arr, mapDimensions, tile) {
  const x = Math.floor(Math.random() * mapDimensions.height);
  const y = Math.floor(Math.random() * mapDimensions.width);

  if (arr[x][y] === tile) {
    const monster = {
      location: { x, y },
      health: 30,
      damage: 10,
    };
    return monster;
  }

  return placeMonster(arr, mapDimensions, tile);
}

export function placeBoss(arr, mapDimensions, tile) {
  const x = mapDimensions.height - 1;
  const y = mapDimensions.width - 1;

  if (arr[x][y] === tile) return { x, y };

  const newMapDimensions = { height: x, width: y };
  return placeBoss(arr, newMapDimensions, tile);
}
