# Webpack library starter

Asynchronous, Web Worker based battleship map generator in JS

## Features

* Webpack 4 based.
* ES6 as a source.
* Exports in a [umd](https://github.com/umdjs/umd) format so library works everywhere.
* Linting with [ESLint](http://eslint.org/).

## Scripts

`npm run build` - produces production version of this library under the `lib` folder

`npm start` - See in browser library usage

## Usage

```javascript
import {BoardGenerator} from '@yufuzu/shipbattle-board'

const generator = new BoardGenerator();
const mapWidth = 10;
const mapHeight = 10;

 generator.randomMap(mapWidth, mapHeight, [
      generator.ship('CRUISER-5', 5),
      generator.ship('CRUISER-4', 4),
      generator.ship('CRUISER-4', 4),
      generator.ship('CRUISER-3', 3),
      generator.ship('CRUISER-3', 3),
      generator.ship('CRUISER-2', 2),
      generator.ship('CRUISER-2', 2),
      generator.ship('CRUISER-2', 2),
      generator.ship('CRUISER-2', 2),
      generator.ship('CRUISER-1', 1),
      generator.ship('CRUISER-1', 1),
      generator.ship('CRUISER-1', 1),
      generator.ship('CRUISER-1', 1),
      generator.ship('CRUISER-1', 1)
    ]).then(fields => console.log(fields));
```
