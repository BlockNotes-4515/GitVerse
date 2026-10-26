# GitVerse — The Universe of Code

> Transform any GitHub profile into an explorable 3D celestial solar system of procedural planets, orbital constellations, and stellar telemetry.

GitVerse turns software engineering into a living cosmic digital universe. Repositories become distinct planets, programming languages define their physical and chromatic identities, community traction determines planetary scale, and the developer's journey radiates from a central incandescent star.

---
<p align="center">
  <img src="media/GitHub Galaxy of Code Worlds.png" alt="GitVerse Preview" width="800">
</p>

<br>

<p align="center">
  <a href="https://gitverse-three.vercel.app/">
    <img src="https://img.shields.io/badge/Explore%20GitVerse-000000?style=for-the-badge&logoColor=white" alt="Explore GitVerse" height="55">
  </a>
</p>

<br>

## Key Features

- **Procedural 3D Planetary Archetypes**:
  - **Terrestrial Worlds**: Cratered rocky surfaces with subtle impact formations (C, Shell, Assembly).
  - **Gas Giants**: Layered atmospheric swirl bands with dynamic turbulence (JavaScript, Java, PHP).
  - **Ice Worlds**: Glacial crystalline fissures with specular reflectivity (TypeScript, Go, Kotlin).
  - **Ringed Worlds**: Saturnian accretion disks orbiting high-traction repositories.
  - **Oceanic Spheres**: Bioluminescent coastlines and cloud haze (Python, Dart, Vue).
  - **Volcanic Worlds**: Obsidian crusts with radiant magma fissures (Rust, Ruby, HTML).
- **Dual Cosmic Layouts**:
  - **Galaxy Mode**: Concentric planetary orbits arranged via Keplerian orbital dynamics and the golden angle spiral (~137.5°).
  - **Tree Mode**: 3D phylogenetic tree organizing repositories into branching linguistic constellations rooted at the developer star.
- **Cinematic Formation Sequence**: Visual progression through signal acquisition, stellar formation, planetary emergence, and orbital calibration.
- **Zero-Asset Engine**: 100% of planet textures, solar corona flares, starfield dust, and ring systems are procedurally generated in code using HTML5 2D Canvas and Three.js shaders.
- **Synthesized Web Audio**: Ambient cosmic drone and resonant planetary frequency pings built entirely with the browser's native Web Audio API (zero external audio files).
- **Public GitHub API**: Fetches real, unauthenticated public profile and repository data with intelligent rate-limit handling, `sessionStorage` caching, and curated instant demo universes (`antfu`, `shadcn`, `torvalds`, `octocat`).
- **Downloadable High-Res Share Cards**: Generates 1200×630 social share cards complete with developer statistics, language distributions, and planetary diagrams for instant PNG export.

---

## Visual & Mathematical Mappings

| Celestial Attribute | GitHub Source Metric | Formula / Mapping |
| :--- | :--- | :--- |
| **Central Star** | Developer Profile | Color from dominant language; Corona flares from star/repo volume |
| **Planet Radius** | Stargazers Count | Logarithmic scale: `1.0 + log10(Stars + 1) * 0.55` |
| **Surface Palette** | Primary Language | 40+ curated GitHub language color palettes |
| **Moons** | Fork Count | 1 to 3 orbiting satellites generated from fork count thresholds |
| **Constellation Lines** | Topics & Languages | Glowing lines connecting nodes with shared topics or languages |
| **Orbital Speed** | Orbital Distance | Kepler's Third Law approximation: `v ∝ 1 / √r` |

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **3D Graphics Engine**: Three.js (r160+) + OrbitControls + PMREM Studio Environment
- **Styling**: Tailwind CSS v4
- **Audio Engine**: Web Audio API (Procedural Oscillators & Biquad Filters)
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/gitverse.git

# Navigate into the project directory
cd gitverse

# Install dependencies
npm install
```

### Local Development

```bash
# Start the Vite development server
npm run dev
```

The application will be available at `http://localhost:3000` (or `http://localhost:5173`).

### Production Build

```bash
# Compile and bundle for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Deployment Instructions

### Deploy to Vercel

1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `gitverse` repository.
4. Keep standard Vite settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**.

### Deploy to Netlify / GitHub Pages

This application is a 100% client-side Single Page Application (SPA). The generated `dist` folder can be served by any static host.

---

## License

Apache-2.0 License. Designed with original creative technology patterns.
