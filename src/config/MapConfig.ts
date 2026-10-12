/**
 * Bagontaas, City of Valencia, Bukidnon, Philippines
 * Center: ~7.906° N, 125.132° E
 */
export interface BoundingBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

export const MapConfig = {
  // Bagontaas town proper core area
  bbox: {
    south: 7.8980,
    west: 125.1220,
    north: 7.9150,
    east: 125.1420
  } as BoundingBox,
  
  // Isometric tile rendering parameters
  tileWidth: 64,
  tileHeight: 32,
  worldWidthTiles: 60,
  worldHeightTiles: 60
};
