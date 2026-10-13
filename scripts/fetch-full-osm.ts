import fs from 'fs';
import path from 'path';

// Bounding box for Bagontaas, Valencia City, Bukidnon (full community area)
// Approx: 7.896°N to 7.922°N, 125.118°E to 125.148°E
const BBOX = {
  south: 7.896,
  west: 125.118,
  north: 7.922,
  east: 125.148
};

async function fetchFullBagontaasOSM() {
  const query = `
    [out:json][timeout:50];
    (
      way["highway"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
      way["building"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
      relation["building"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
      node["amenity"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
      way["amenity"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
    );
    out body;
    >;
    out skel qt;
  `;

  console.log('Fetching comprehensive Bagontaas street and building data from Overpass...');
  const mirrors = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter'
  ];

  for (const url of mirrors) {
    try {
      console.log(`Querying ${url}...`);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'BagontaasExplorer3D/2.0'
        },
        body: 'data=' + encodeURIComponent(query.trim())
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`Success! Fetched ${data.elements.length} elements from ${url}.`);
        return data;
      }
    } catch {
      console.warn(`Failed mirror ${url}, trying next...`);
    }
  }

  throw new Error('All Overpass mirrors failed.');
}

async function run() {
  try {
    const data = await fetchFullBagontaasOSM();
    const outDir = path.resolve(process.cwd(), 'public/assets/maps');
    fs.mkdirSync(outDir, { recursive: true });

    const outFile = path.join(outDir, 'bagontaas-osm-full.json');
    fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
    console.log(`Saved full OSM dataset to ${outFile}`);
  } catch (err) {
    console.error('Error fetching full OSM data:', err);
  }
}

run();
