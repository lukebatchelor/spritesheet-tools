type Opts = {
  // add in background color
};

function getSpriteBoundingBoxes(imgData: ImageData, opts: Opts) {
  const { height, width, data } = imgData;
  console.log({ height, width, pixels: width * height });
  // List of known objects we have so far
  const sprites = [];
  const pixelMap = createAlphaMask(imgData);
  let spriteId = 1;

  for (let i = 0; i < width * height * 4; i += 4) {
    const idx = Math.floor(i / 4); // idx for the number of "pixels"

    if (pixelMap[idx] !== undefined) continue; // if we've seen this pixel before, skip

    const y = Math.floor(idx / width); // x and y coord of the pixel
    const x = idx % width;

    const r = data[i]; // get color data of pixel
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue; // transparent pixel, ignore it
    // we've found a pixel, find all the connected pixels that make up a sprite

    const connectedPixels = {
      minX: x,
      minY: y,
      maxX: x,
      maxY: y,
      pixels: []
    };

    depthFirstFloodFill(x, y, spriteId, pixelMap, imgData, connectedPixels);
    if (connectedPixels.pixels.length > 36) {
      spriteId += 1;
      sprites.push(connectedPixels);
    }
  }

  console.log('Done');
  console.log(sprites);
  return sprites;
}

type ConnectedPixels = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  pixels: Array<object>;
};

function depthFirstFloodFill(
  xStart: number,
  yStart: number,
  id: number,
  pixelMap: Array<number>,
  imgData: ImageData,
  connectedPixels: ConnectedPixels
) {
  const { height, width } = imgData;
  const hasVisited = (x: number, y: number) => pixelMap[y * width + x] !== undefined;
  const outOfBounds = (x: number, y: number) => x < 0 || y < 0 || x >= width || y >= height;
  const getNeighbours = (x: number, y: number) => [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1]
  ];

  const toVisit = [[xStart, yStart]];
  while (toVisit.length !== 0) {
    const [x, y] = toVisit.shift()!;
    if (outOfBounds(x, y)) continue;
    if (hasVisited(x, y)) continue;

    pixelMap[y * width + x] = id;
    connectedPixels.minX = Math.min(connectedPixels.minX, x);
    connectedPixels.minY = Math.min(connectedPixels.minY, y);
    connectedPixels.maxX = Math.max(connectedPixels.maxX, x);
    connectedPixels.maxY = Math.max(connectedPixels.maxY, y);
    connectedPixels.pixels.push({ x, y });

    const neighbours = getNeighbours(x, y);
    neighbours.forEach(n => toVisit.push(n));
  }

  return connectedPixels;
}

// For now, assume it's the top-right pixel
function getBackgroundColor(imgData: ImageData) {
  const { width, data } = imgData;
  const startIdx = width * 4;
  return [data[startIdx], data[startIdx + 1], data[startIdx + 2], data[startIdx + 3]];
}

function createAlphaMask(imgData: ImageData): Array<number> {
  const { height, width, data } = imgData;
  const bgColor = getBackgroundColor(imgData);
  // 1d array of values where -1 indicates background pixel
  const alphaMask = new Array(height * width);
  const [aR, aG, aB, aA] = bgColor; // our background colors

  let idx = 0; // index into the alphaMask array
  for (let i = 0; i < width * height * 4; i += 4, idx++) {
    if (
      data[i + 3] === 0 ||
      (data[i] === aR && data[i + 1] === aG && data[i + 2] === aB && data[i + 3] === aA)
    ) {
      alphaMask[idx] = -1;
    }
  }

  return alphaMask;
}

export { getSpriteBoundingBoxes };
