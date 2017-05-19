export default function getViewBoundary(player, mapDimensions, viewSize) {
  const mapBoundaries = {};
  mapBoundaries.top = player.x - viewSize;
  mapBoundaries.left = player.y - viewSize;
  mapBoundaries.bottom = player.x + viewSize;
  mapBoundaries.right = player.y + viewSize;

  if (mapBoundaries.top < 0) {
    const excessBoundaryTop = Math.abs(mapBoundaries.top);
    mapBoundaries.top = 0;
    mapBoundaries.bottom += excessBoundaryTop;
  }

  if (mapBoundaries.left < 0) {
    const excessBoundaryLeft = Math.abs(mapBoundaries.left);
    mapBoundaries.left = 0;
    mapBoundaries.right += excessBoundaryLeft;
  }

  if (mapBoundaries.bottom >= mapDimensions.height) {
    const excessBoundaryBottom = Math.abs(mapBoundaries.bottom - mapDimensions.height);
    mapBoundaries.bottom = mapDimensions.height - 1;
    mapBoundaries.top -= excessBoundaryBottom + 1;
  }

  if (mapBoundaries.right >= mapDimensions.width) {
    const excessBoundaryRight = Math.abs(mapBoundaries.right - mapDimensions.width);
    mapBoundaries.right = mapDimensions.width - 1;
    mapBoundaries.left -= excessBoundaryRight + 1;
  }

  return mapBoundaries;
}
