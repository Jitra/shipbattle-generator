function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);

    return v.toString(16);
  });
}

const FieldSearch = {
  getRandomFreeField: function (board, compartments) {
    const emptyFields = board.fields.filter((field) => !field.ship && !field.marked);

    if (emptyFields.length < compartments) {
      throw new Error('Not enough empty fields');
    }
    const randomIndex = Math.floor(Math.random() * (emptyFields.length - 1));
    const field = emptyFields[randomIndex];

    this.markChecked([field]);
    return field;
  },
  markChecked: function (fields) {
    fields.forEach(field => field.marked = true);
  },
  unmarkChecked: function (fields) {
    fields.forEach(field => delete field.marked);
  },
  calculateHorizontal: function (compartments, board) {
    let points = [], extraPart, startX, endX;

    do {
      points = [];
      let randomField = this.getRandomFreeField(board, compartments);

      startX = randomField.x - compartments;
      startX = startX >= board.minX ? startX : board.minX;
      endX = randomField.x + compartments;
      endX = endX <= board.maxX ? endX : board.maxX;
      // extra fixing
      startX = endX === board.maxX ? startX - 1 : startX;
      endX = startX === board.minX ? endX + 1 : endX;
      extraPart = 2;

      for (let startXi = startX; startXi <= endX && points.length !== (compartments + extraPart); startXi++) {
        let fieldAboveIndex = board.fields.findIndex(field => {
          return field.x === startXi && field.y === randomField.y - 1;
        });
        let fieldIndex = board.fields.findIndex(field => {
          return field.x === startXi && field.y === randomField.y && !field.ship;
        });
        let fieldBelowIndex = board.fields.findIndex(field => {
          return field.x === startXi && field.y === randomField.y + 1;
        });

        if (fieldIndex !== -1 &&
          (fieldAboveIndex === -1 || !board.fields[fieldAboveIndex].ship) &&
          (fieldBelowIndex === -1 || !board.fields[fieldBelowIndex].ship)) {
          points.push(board.fields[fieldIndex]);
        } else {
          this.markChecked(points);
          points = [];
          continue;
        }
      }
    } while (points.length < compartments + extraPart);

    if (points[0].x === board.minX) {
      points = points.slice(0, points.length - extraPart);
    } else if (points[points.length - 1].x === board.maxX) {
      points = points.slice(extraPart);
    } else {
      points = points.slice(1, points.length - 1);
    }

    return points;
  },
  calculateVertical: function (compartments, board) {
    let extraPart = 2, points;

    do {
      const randomPoint = FieldSearch.getRandomFreeField(board, compartments);
      // get sorted y1 to y10 where x is equal = randomPoint

      const yLine = board.fields.filter(field => field.x === randomPoint.x).sort((a, b) => a.y - b.y);

      points = [];
      for (let minYi = board.minY - 1; minYi < board.maxY - 1 && points.length < compartments + extraPart; minYi++) {
        const leftFieldIndex = board.fields.findIndex(field => field.y === yLine[minYi].y && field.x === randomPoint.x - 1);
        const rightFieldIndex = board.fields.findIndex(field => field.y === yLine[minYi].y && field.x === randomPoint.x + 1);

        if (!yLine[minYi].ship &&
          (leftFieldIndex === -1 || !board.fields[leftFieldIndex].ship) &&
          (rightFieldIndex === -1 || !board.fields[rightFieldIndex].ship)
        ) {
          points.push(yLine[minYi]);
        } else {
          points = [];
        }
      }
    } while (points.length < compartments + extraPart);
    if (points[0].y === board.minY) {
      points = points.slice(0, points.length - extraPart);
    } else if (points[points.length - 1].y === board.maxY) {
      points = points.slice(extraPart);
    } else {
      points = points.slice(1, points.length - 1);
    }

    return points;
  }
};

const addShips = function (ships, board) {

  const sortedShips = ships.sort((a, b) => a.compartments - b.compartments);
  let newShipsFields = [], errors = 0;

  do {
    try {
      for (let shipI = sortedShips.length - 1; shipI > 0; shipI--) {
        const horizontal = Math.floor(Math.random() * 2);
        let nextShipFields = [];

        if (horizontal) {
          nextShipFields = FieldSearch.calculateHorizontal(
            ships[shipI].compartments,
            board
          );
        } else {
          nextShipFields = FieldSearch.calculateVertical(
            ships[shipI].compartments,
            board
          );
        }

        nextShipFields.forEach(field => field.ship = {...ships[shipI], id: uuidv4()});
        newShipsFields.push(...nextShipFields);
        FieldSearch.unmarkChecked(board.fields);
      }
      break;
    } catch (error) {
      errors++;
      newShipsFields.forEach(field => delete field.ship);
    }
  } while (errors < 7);
  if (errors === 7) {
    throw new Error('Too much tries');
  }
};

onmessage = function (e) {
  const {type, msgId, payload: {ships, board}} = e.data;
  let errors;

  switch (type) {
    case 'ADD_SHIPS':
      try {
        addShips(ships, board);
      } catch (e) {
        errors = e.toString();
      }

      postMessage({msgId, errors, board});
      break;
  }
};
