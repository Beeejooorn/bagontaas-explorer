import fs from 'fs';
import path from 'path';

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

export interface OverpassResponse {
  elements: (OSMNode | OSMWay)[];
}

// Bounding box for Bagontaas town center
const BBOX = {
  south: 7.900,
  west: 125.125,
  north: 7.913,
  east: 125.140
};

async function fetchBagontaasOSM(): Promise<OverpassResponse> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
      way["highway"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
    );
    out body;
    >;
    out skel qt;
  `;

  console.log('Querying Overpass API for Bagontaas town landmarks and highways...');
  const res = await fetch('https://overpass.kumi.systems/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'BagontaasExplorer/1.0 (portfolio project)'
    },
    body: 'data=' + encodeURIComponent(query.trim())
  });

  if (!res.ok) {
    throw new Error(`Overpass API responded with HTTP ${res.status}`);
  }

  const data = await res.json() as OverpassResponse;
  console.log(`Successfully fetched ${data.elements.length} elements from OpenStreetMap!`);
  return data;
}

async function run() {
  const data = await fetchBagontaasOSM();
  const outDir = path.resolve(process.cwd(), 'public/assets/maps');
  fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, 'bagontaas-osm.json');
  fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
  console.log(`Saved live OSM data to ${outFile}`);
}

run();
