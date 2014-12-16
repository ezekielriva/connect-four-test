var client    = new Faye.Client('/faye');
var tableTop  = [[], [], [], [], [], [], []];
var playerId  = location.pathname.match(/\d+/)[0];
var playerColor;

$('td').toggleClass('empty');

$('td').each(function () {
  var columnNo = $(this).index();
  tableTop[columnNo].push( $(this)[0] );
});

if ( Boolean(location.pathname.search('user')) ) {
  client.subscribe('/game', function (playload) {
    if ('play' === playload.action) handlePlay(playload);
    if ('winner' === playload.action) handleWinner(playload);
  });

  var publish = client.publish('/game', {
    message: "Hello I'm " + location.pathname.match(/\d+/)[0]
  });
};

function handlePlay (playload) {
  var emptyElements = tableTop[ parseInt(playload.column) ].filter(function (element) {
    return element.classList.contains('empty');
  });

  var firstEmpty = emptyElements[emptyElements.length - 1];

  $(firstEmpty).css('backgroundColor', playload.color).toggleClass('empty');

  if( checkWinner(emptyElements.length - 1, parseInt(playload.column) ) ) {
    client.publish('/game', { action: 'winner', message: 'There is a Winner: ' + playload.playerId } );
  }
};

function handleWinner (playload) {
  alert(playload.message);
  location.reload();
}

function checkWinner (row, column) {
  var count   = 0;
  var columns  = tableTop[column];
  var rows     = [];

  for (var i = 0; i < tableTop.length; i++) {
    rows.push(tableTop[i][row]);
  }

  /* Vertical check */
  if ( row > 4 ) {
    for (var i = columns[row]; i >= 0; i--) {
      if ( playerColor !== rows[i].style.backgroundColor ) break;
      if ( playerColor === columns[i].style.backgroundColor ) count++;
    };
  } else {
    for (var i = row; i < column.length; i++) {
      if ( columns[i].classList.contains('empty') ||
           playerColor !== rows[i].style.backgroundColor ) break;
      if ( playerColor === columns[i].style.backgroundColor ) count++;
    };
  }

  if (4 === count) { return true; }

  /* Horizontal check */
  count = 0;
  if ( column > 4 ) {
    for (var i = rows.length - 1; i >= 0; i--) {
      if ( rows[i].classList.contains('empty') ||
           playerColor !== rows[i].style.backgroundColor ) break;
      if ( playerColor === rows[i].style.backgroundColor ) count++;
    };
  } else {
    for (var i = 0; i < rows.length; i++) {
      if ( rows[i].classList.contains('empty') ||
           playerColor !== rows[i].style.backgroundColor ) break;
      if ( playerColor === rows[i].style.backgroundColor ) count++;
    };
  }

  if (4 === count) { return true; }

  /* Diagonal check */
  count = 0;
  var j = row;
  /* X+ Y+ */
  for (var i = column; i < columns.length; i++) {
    console.log("X+ Y+", i, j);
    if ( tableTop[i][j] && playerColor === tableTop[i][j].style.backgroundColor ) count++;
    j--;
    if (4 === count) { return true; }
  };

  /* X+ Y- */
  count = 0;
  j = row;
  for (var i = column; i < columns.length; i++) {
    console.log("X+ Y-", i, j);
    if ( tableTop[i][j] && playerColor === tableTop[i][j].style.backgroundColor ) count++;
    j++;
    if (4 === count) { return true; }
  };

  /* X- Y+ */
  count = 0;
  j = row;
  for (var i = column; i >= 0; i--) {
    console.log("X- Y+", i, j);
    if ( tableTop[i][j] && playerColor === tableTop[i][j].style.backgroundColor ) count++;
    j--;
    if (4 === count) { return true; }
  };

  /* X+ Y- */
  count = 0;
  j = row;
  for (var i = column; i >= 0; i--) {
    console.log("X+ Y-", i, j);
    if ( tableTop[i][j] && playerColor === tableTop[i][j].style.backgroundColor ) count++;
    j++;
    if (4 === count) { return true; }
  };

  return false;
};


$(document).on('ready', function () {
  $('.drop-link').click(function (e) {
    e.preventDefault();

    var column = this.getAttribute('data-column');

    var publish = client.publish('/game', {
      action:   'play',
      column:   column,
      playerId: playerId,
      color:    playerColor });
  });

  $('.pickColor').click(function (e) {
    e.preventDefault();
    playerColor = this.innerHTML;
    $('.pick-color-label').remove();
  })
})
