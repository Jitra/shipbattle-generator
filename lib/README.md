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

const board = new shipbattle.BoardGenerator();
const mapWidth = 10;
const mapHeight = 10;

 board.randomMap(mapWidth, mapHeight, [
      board.ship('CRUISER-5', 5),
      board.ship('CRUISER-4', 4),
      board.ship('CRUISER-4', 4),
      board.ship('CRUISER-3', 3),
      board.ship('CRUISER-3', 3),
      board.ship('CRUISER-2', 2),
      board.ship('CRUISER-2', 2),
      board.ship('CRUISER-2', 2),
      board.ship('CRUISER-2', 2),
      board.ship('CRUISER-1', 1),
      board.ship('CRUISER-1', 1),
      board.ship('CRUISER-1', 1),
      board.ship('CRUISER-1', 1),
      board.ship('CRUISER-1', 1)
    ]).then(fields => console.log(fields));
```
