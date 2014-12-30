  var client    = new Faye.Client('/faye');
  var $tabletop  = [[], [], [], [], [], [], []];
  var playerId  = location.pathname.match(/\d+/)[0];
  var playerColor;

  const ERRORS = {
    notTurn: "Hey! this turn isn't yours. Wait! :D"
  }

  console.info("Wellcome to Connect Four Game.");
  console.info("You're the Player No",playerId);

  var currentPlayer   = new Player(playerId);
  var game            = new Game();

  if ( currentPlayer.isPlayerOne() ) {
    game.setPlayerOne(currentPlayer);
    toogleMyTurn();
  } else {
    game.setPlayerTwo(currentPlayer);
  }

  if ( Boolean(location.pathname.search('game')) ) {
    settingUpGame();

    client.subscribe('/game', function (playload) {
      var cell;

      if ( 'play' === playload.action ) {
        if( game.play(playload) ) {
          paintCell();
          game.nextTurn();
          toogleMyTurn();
          if ( game.winner ) {
            client.publish('/game', {action: 'winner', playerId: playload.playerId});
          }
        }
      }

      if ('winner' === playload.action) {
        alert('The winner is: Player '+playload.playerId );
      }
    });

  }

  function settingUpGame () {
    console.log('Waitting for another player');

    var privateRoom = client.subscribe('/game/'+ currentPlayer.getId(), function(playload){
      var opponent = new Player(playload.playerId);
      game.setOpponent( opponent );

      if ( game.areAllPlayersConnected() ) {
        console.log("All Players have been connected. The game is ready");
        privateRoom.cancel();
        client.publish('/game/' + playload.playerId, {
          action: 'opponent',
          playerId: currentPlayer.getId()
        });
      }
    });

    client.publish('/game/' + game.getOpponentId( currentPlayer ), {
      action: 'opponent',
      playerId: currentPlayer.getId()
    });
  }

  $(document).on('ready', function () {
    $('.drop-link').click(function (e) {
      e.preventDefault();

      if ( game.isMyTurn(currentPlayer) ) {
        var column = this.getAttribute('data-column');

        var publish = client.publish('/game', {
          action:   'play',
          column:   column,
          playerId: currentPlayer.getId() });
      } else {
        displayError(ERRORS.notTurn);
        console.error(ERRORS.notTurn);
      }
    });
  });

  $('td').each(function () {
    var columnNo = $(this).index();
    $tabletop[columnNo].push( $(this)[0] );
  });

  function paintCell () {
    var column = game.getLastColumn(),
        row    = $tabletop[column].length - 1 - game.getLastRow(),
        color  = game.getCurrentPlayer().getColor()
    ;

    $( $tabletop[column][row] ).find('.circle').css('backgroundColor', color);
  }

  function displayError(error) {
    $('.alert').html(error).fadeIn().delay(3000).fadeOut();
  }

  function toogleMyTurn () {
    $('.my-turn').toggle();
  }
