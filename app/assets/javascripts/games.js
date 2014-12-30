var Game = (function(WinnerService){

  function buildTableTop() {
    for (var i = 0; i < 6; i++) {
      this.tabletop.push( new Array(7) );
    };
  }

  function fillColumn (column, playerId) {
    for ( var row = 0; row < this.tabletop.length; row++ ) {
      if ( undefined === this.tabletop[row][column] ) {
        this.tabletop[row][column] = playerId;
        this.lastRow               = row;
        this.lastColumn            = column;
        return true;
      }
    }

    return false;
  }

  function checkWinner (row, column, currentPlayerId) {
    var service = new WinnerService(this.tabletop, currentPlayerId),
        winner  = service.perform(row, parseInt(column))
    ;

    return winner;
  }

  function Game() {
    var __proto__;

    this.playerOne  = undefined;
    this.playerTwo  = undefined;
    this.turn       = 1;
    this.winner     = undefined;
    this.tabletop   = [];
    this.lastRow    = undefined;
    this.lastColumn = undefined;

    __proto__ = Game.prototype;

    buildTableTop.call(this);

    __proto__.setPlayerOne  = function (player) { this.playerOne = player; }
    __proto__.setPlayerTwo  = function (player) { this.playerTwo = player; }

    __proto__.getPlayerOne  = function () { return this.playerOne; }
    __proto__.getPlayerTwo  = function () { return this.playerTwo; }
    __proto__.getLastRow    = function () { return this.lastRow; }
    __proto__.getLastColumn = function () { return this.lastColumn; }

    __proto__.setOpponent  = function (player) {
      if ( undefined === this.playerOne ) {
        this.playerOne = player;
      } else {
        this.playerTwo = player;
      }
    }

    __proto__.getOpponentId = function (currentPlayer) {
      return ( currentPlayer.isPlayerOne() )? 2 : 1;
    }

    __proto__.areAllPlayersConnected = function () {
      return ( Boolean(this.playerOne) && Boolean(this.playerTwo) );
    }

    __proto__.nextTurn = function () {
      console.log('Next turn:', (this.turn + 1) );
      return this.turn++;
    }

    __proto__.isMyTurn = function (player) {
      return player === this.getCurrentPlayer();
    }

    __proto__.getCurrentPlayer = function () {
      return ( 0 === (this.turn % 2) )? this.playerTwo : this.playerOne;
    }

    __proto__.play  = function (data) {
      this.lastRow = this.lastColumn = undefined;

      if ( fillColumn.call(this, data.column, data.playerId) ) {
        this.winner =
          checkWinner.call(this, this.lastRow, this.lastColumn, data.playerId);
        return true;
      }

      console.error('You did an imposible move. Try again');
      return false;
    }
  }

  return Game;
})(WinnerService);
