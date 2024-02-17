# Uses maplibre + deck.gl + nebula.gl

This repo reproduces some errors/issues I faced using deck.gl, nebula.gl and maplibre.

## Usage

- install pnpm (if not installed): `npm install --global pnpm`
- install dependencies: run `pnpm i`
- start dev server and open provided url in browser: `pnpm dev`

## Some learnings
- Either use deck.gl or `@deck.gl/*` packages. deck.gl has all of them. Same of nebula.gl. See https://github.com/maplibre/maplibre-gl-js/issues/2834#issuecomment-1627785928
  - I couldn't find the TS types for deck.gl stuff from `deck.gl` though
- there were conflicts with using @deck.gl/*/typed vs "@danmarshall/deckgl-typings": "^4.9.28", types