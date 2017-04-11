export function placePlayer(arr, x, y, tile) {
  if (arr[x][y] === tile) return { x, y };

  return placePlayer(arr, x + 1, y + 1, tile);
}

export function placeEntity(arr, height, width, tile) {
  const x = Math.floor(Math.random() * height);
  const y = Math.floor(Math.random() * width);

  if (arr[x][y] === tile) return { x, y };

  return placeEntity(arr, height, width, tile);
}

export function placeBoss(arr, x, y, tile) {
  if (arr[x][y] === tile) return { x, y };

  return placeBoss(arr, x - 1, y - 1, tile);
}
