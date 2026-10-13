export interface OSMNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

export interface OSMWay {
  type: 'way';
  id: number;
  nodes: number[];
  tags?: Record<string, string>;
}

export interface OSMData {
  elements: (OSMNode | OSMWay)[];
}

// Bounding box for Bagontaas
export const BAGONTAAS_CENTER = {
  lat: 7.9075,
  lon: 125.1300
};

// Conversions from Lat/Lon to 3D world meters (Mercator projection centered at Bagontaas)
export function latLonToWorld(lat: number, lon: number): { x: number; z: number } {
  const earthRadius = 6378137; // meters
  const dLat = (lat - BAGONTAAS_CENTER.lat) * (Math.PI / 180);
  const dLon = (lon - BAGONTAAS_CENTER.lon) * (Math.PI / 180);
  const cosLat = Math.cos(BAGONTAAS_CENTER.lat * (Math.PI / 180));

  // Scale down for 3D world units (1 unit = ~2 meters)
  const scale = 0.5;
  const x = dLon * earthRadius * cosLat * scale;
  const z = -dLat * earthRadius * scale; // Inverted Z for Three.js North

  return { x, z };
}
