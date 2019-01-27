import Worker from './BoardGenerator.worker';

const BoardGenerator = (function () {

  function initMap(width, height) {
    const map = {fields: [], minX: 1, minY: 1, maxX: width, maxY: height};

    for (let heightI = map.minY; heightI <= height; heightI++) {
      for (let widthI = map.minX; widthI <= width; widthI++) {
        // let ship = Math.floor(Math.random()*25) === 5? 'CRUISER': undefined;
        let ship = null;

        map.fields.push({hit: false, x: widthI, y: heightI, ship});
      }
    }

    return map;
  }

  function Board() {
    let counter = 0;
    const promiseRef = {};
    let worker;

    if (!worker) {
      worker = new Worker();
      worker.onmessage = function (e) {
        if (!e.data.errors) {
          promiseRef[e.data.msgId].resolve(e.data.board.fields);
        } else {
          promiseRef[e.data.msgId].reject({message: 'Could not create map'});
        }
      };
    }

    function sendMessage(message) {
      let msgId = 'msg' + counter++;

      promiseRef[msgId] = {resolve: undefined, reject: undefined};
      message.msgId = msgId;
      worker.postMessage(message);

      return (new Promise((resolve, reject) => {
        promiseRef[msgId].resolve = resolve;
        promiseRef[msgId].reject = reject;
      }));
    }

    this.randomMap = function (width, height, ships) {
      const board = initMap(width, height);
      const message = {type: 'ADD_SHIPS', payload: {ships, board}};

      return sendMessage(message);
    };

    this.ship = function (name, compartments) {
      return {name, compartments};
    };
  }

  return Board;
})();

export {BoardGenerator};
