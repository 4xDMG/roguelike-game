export default function generateMap(height, width) {
  const mapArray = [];

  for (let i = 0; i < height; i += 1) {
    mapArray.push([]);
    for (let j = 0; j < width; j += 1) {
      if (Math.random() < 0.45) {
        mapArray[i].push('#');
      } else {
        mapArray[i].push('.');
      }
    }
  }

  return mapArray;
}
