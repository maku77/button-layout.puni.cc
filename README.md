# Button Layout Editor

A web-based tool for creating and exporting button layout images for leverless (hitbox-style) fighting game controllers.

## Features

- Visual button layout editor with click-to-assign interface
- Guilty Gear Strive action set (P, K, S, HS, D, Dash, FD, RC, Burst, Taunt)
- Export layout as transparent PNG
- Customizable controller definitions

## Tech Stack

- Vite + TypeScript (no framework)
- Canvas API for rendering and PNG export

## Getting Started

```sh
pnpm install
pnpm dev
```

## Usage

1. Click a button on the controller layout
2. Select an action from the panel on the right
3. Click "Save as PNG" to download the image

## Adding Controllers

Edit `src/controllers.ts` to define new controller layouts with custom button positions and sizes.

## Adding Games

Edit `src/games.ts` to add new game action sets. Place icon images in `src/assets/` and reference them in `src/icons/`.
