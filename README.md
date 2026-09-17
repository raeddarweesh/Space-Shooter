# Space Shooter

A modern 2D space shooter game built with React, TypeScript, and Vite. Defend the galaxy against waves of enemy ships, collect power-ups, and compete for high scores in this fast-paced arcade experience.

## Features

- **Classic arcade gameplay** — Control your ship, dodge enemy fire, and blast through waves of enemies.
- **Multiple enemy types** — Fight enemy cruisers, drones, fighters, and orbs, each with distinct behaviour.
- **Power-ups** — Collect power-ups to upgrade your weapons and survive longer.
- **Pause & resume** — Pause the action at any time and jump right back in.
- **High-score tracking** — Compete for the top spot on the leaderboard.
- **Sprite-based visuals** — Custom sprites for the player, enemies, explosions, muzzle flashes, and projectiles.
- **Responsive design** — Works on both desktop and mobile browsers.

## Screenshots

| Gameplay | Paused | Scores |
| --- | --- | --- |
| ![Gameplay](https://github.com/raeddarweesh/Space-Shooter/blob/main/screenshots/gameplay.png?raw=true) | ![Paused](https://github.com/raeddarweesh/Space-Shooter/blob/main/screenshots/paused.png?raw=true) | ![Scores](https://github.com/raeddarweesh/Space-Shooter/blob/main/screenshots/scores.png?raw=true) |

| App Builder (Built) | App Builder (Preview) |
| --- | --- |
| ![App Builder Built](https://github.com/raeddarweesh/Space-Shooter/blob/main/screenshots/app-builder-built.png?raw=true) | ![App Builder Preview](https://github.com/raeddarweesh/Space-Shooter/blob/main/screenshots/app-builder-preview.png?raw=true) |

| Mobile (Built) | Mobile (Preview) |
| --- | --- |
| ![App Builder Built Mobile](https://github.com/raeddarweesh/Space-Shooter/blob/main/screenshots/app-builder-built-mobile.png?raw=true) | ![App Builder Preview Mobile](https://github.com/raeddarweesh/Space-Shooter/blob/main/screenshots/app-builder-preview-mobile.png?raw=true) |

> All screenshots are stored in the [`screenshots`](./screenshots) folder.

## Tech Stack

- **Framework:** [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build tool:** [Vite](https://vitejs.dev/)
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **State management:** [TanStack Query](https://tanstack.com/query)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) primitives
- **Backend / database:** [Kysely](https://kysely.dev/) + [PGlite](https://github.com/electric-sql/pglite) (PostgreSQL in the browser)
- **Authentication:** [Better Auth](https://www.better-auth.com/)

## Getting Started

### Prerequisites

- **Node.js** (v20 or later recommended)
- **npm** (or a compatible package manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/raeddarweesh/Space-Shooter.git
   cd Space-Shooter

2. **Install dependencies:**

    ```bash
    npm install
    Running the Game
    
3. **Start the development server:**

    ```bash
    npm run dev
    The game will be available at http://localhost:8080.

4. **Building for Production:**
    ```bash
    npm run build

This will create an optimised build in the dist folder.

Previewing the Production Build
bash
npm run preview
