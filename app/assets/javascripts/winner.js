var WinnerService = (function () {
  function isInvalidCell(row, column) {
    if ( row < 0 || column < 0 || column > 6 || row > 5 ) {
      return true
    }
    return false
  }


  function WinnerService (tabletopParam, id) {
    var __proto__ = WinnerService.prototype;

    this.tabletop        = tabletopParam;
    this.expectedResult  = parseInt(id) * 4;
    this.directions      = [
      { x:  1,  y:  0 }, // Move Horizontal
      { x: -1,  y:  0 }, // Move Horizontal (-)
      { x:  0,  y:  1 }, // Move Vertical
      { x:  0,  y: -1 }, // Move Vertical (-)
      { x:  1,  y:  1 }, // Move /
      { x: -1,  y: -1 }, // Move / (-)
      { x: -1,  y:  1 }, // Move \
      { x:  1,  y: -1 }  // Move \ (-)
    ]

    __proto__.perform = function (row, column) {
      var result, realRow, realColumn;

      for (var direction = 0; direction < this.directions.length; direction++) {
        result = 0;

        for(var i = 0; i < 4; i++) {
          realRow     = row    + this.directions[direction].x * i;
          realColumn  = column + this.directions[direction].y * i;

          if ( isInvalidCell.call(this, realRow, realColumn) )
            continue;

          if ( id !== this.tabletop[realRow][realColumn] ) continue;

          if ( id === this.tabletop[realRow][realColumn] ) result += parseInt(id);
        }

        if ( this.expectedResult === result ) return true
      }

      realRow = realColumn = undefined;
    }

    return false;
  }

  return WinnerService;
})();
