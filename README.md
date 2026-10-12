# 🗺️ Bagontaas Explorer

> An interactive browser-based pixel RPG recreating the town center of **Bagontaas, Valencia City, Bukidnon**, powered by real-world OpenStreetMap data, real-time day/night lighting, and retro RPG exploration mechanics.

---

## 🎮 Play Live
- **Live Demo:** [https://Beeejooorn.github.io/bagontaas-explorer/](https://Beeejooorn.github.io/bagontaas-explorer/)
- **Repository:** [https://github.com/Beeejooorn/bagontaas-explorer](https://github.com/Beeejooorn/bagontaas-explorer)

---

## ✨ Features & Gameplay Loops

1. **Town Exploration & Barangay Directory (Micro Loop)**
   - Roam freely along the roads and alleys of Bagontaas with 8-directional movement.
   - Walk near landmark buildings (Barangay Hall, Bagontaas Public Market, Covered Court, San Isidro Labrador Church, Central Elementary School).
   - Press **`E`** or **`SPACE`** to inspect the building, read local lore and trivia, and collect stamps in your on-screen **Barangay Directory**.

2. **Living Town & Ambient Street Life (Macro Loop)**
   - **Philippine Tricycles:** Custom pixel-art sidecar tricycles actively patrolling the main highway.
   - **Real-Time Day/Night Cycle:** Lighting overlay mapped to Philippine Standard Time (PST / UTC+8).
   - **Instant Time Scrubber Hotkeys:** Switch lighting anytime to test atmospheres:
     - `1` = 🌅 Dawn (Morning amber glow)
     - `2` = ☀️ Noon (Clear tropical midday sun)
     - `3` = 🌇 Sunset / Dusk (Golden twilight)
     - `4` = 🌙 Midnight (Atmospheric blue night overlay with lit windows)
     - `5` = ⏱️ Realtime (Live Philippine local clock)

3. **Character Selection (Title Menu)**
   - Choose your resident before entering the town:
     - **Juan** (Local Explorer)
     - **Maria** (Student Resident)
     - **Datu** (Community Elder)
     - **Tala** (Bukidnon Adventurer)

4. **Real OpenStreetMap Pipeline**
   - Live query script targeting the Overpass API to convert real GPS nodes, ways, and community amenities from Bagontaas into a playable Phaser 3 isometric world.

---

## 🕹️ Controls

| Action | Key / Control |
|---|---|
| **Move** | `W`, `A`, `S`, `D` or Arrow Keys |
| **Inspect / Close Dialog** | `E` or `SPACE` |
| **Time of Day Scrubber** | Keys `1`, `2`, `3`, `4`, `5` |
| **Character Select (Menu)** | `◄` / `►` or Click Buttons, `ENTER` to Start |

---

## 🛠️ Tech Stack

- **Game Engine:** [Phaser.js 3](https://phaser.io/)
- **Bundler & Tooling:** [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Map Data:** [OpenStreetMap](https://www.openstreetmap.org/) via [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API)
- **Deployment:** GitHub Actions + GitHub Pages

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/Beeejooorn/bagontaas-explorer.git
cd bagontaas-explorer

# Install dependencies
npm install

# Start development server
npm run dev

# Re-fetch live OSM data
npm run convert:osm

# Build production bundle
npm run build
```

---

## 📄 License
MIT License © 2026 Beeejooorn
