// Web Mercator for the map tiles behind a route (no runes, so node --test can import it).
export const MAX_Z = 17;
const TILE = 256;

// [lat, lon] at zoom z -> [x, y] in world pixels of 256-px tiles
export function project(lat, lon, z) {
  const s = TILE * 2 ** z, r = (lat * Math.PI) / 180;
  return [((lon + 180) / 360) * s, ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * s];
}

// The route fitted into a width × height box: the largest zoom at which its extent fits inside `pad`, the extent centred, the tiles that cover the box (`left`/`top` in box pixels) and the route's points in box pixels.
export function backdrop(points, width, height, pad = 8) {
  const w = width - 2 * pad, h = height - 2 * pad;
  let z = MAX_Z, xy;
  for (; ; z--) {
    xy = points.map(([lat, lon]) => project(lat, lon, z));
    const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]);
    if (z === 0 || (Math.max(...xs) - Math.min(...xs) <= w && Math.max(...ys) - Math.min(...ys) <= h)) {
      // whole pixels, so the tiles meet without hairline seams (the points share the origin, so they stay aligned)
      const ox = Math.round((Math.max(...xs) + Math.min(...xs)) / 2 - width / 2), oy = Math.round((Math.max(...ys) + Math.min(...ys)) / 2 - height / 2);
      const tiles = [];
      for (let x = Math.floor(ox / TILE); x <= Math.floor((ox + width - 1) / TILE); x++)
        for (let y = Math.floor(oy / TILE); y <= Math.floor((oy + height - 1) / TILE); y++)
          if (y >= 0 && y < 2 ** z) tiles.push({ z, x, y, left: x * TILE - ox, top: y * TILE - oy });
      return { z, tiles, points: xy.map(([x, y]) => [x - ox, y - oy]) };
    }
  }
}

// relative, so the page asks Home Assistant and never an outside host
export const tileUrl = ({ z, x, y }) => `api/ui/tiles/${z}/${x}/${y}.png`;
