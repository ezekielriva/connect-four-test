var Player = (function(){
  function Player(id) {
    var __proto__;

    this.id   = parseInt(id);
    __proto__ = Player.prototype;

    __proto__.getColor    = function () { return ( this.isPlayerOne() )? '#F44336' : '#FFEB3B'; }
    __proto__.getId       = function () { return this.id; }
    __proto__.isPlayerOne = function () { return 1 === this.id }
  }

  return Player;
})();
