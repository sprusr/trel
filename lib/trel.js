var blessed = require('blessed');
var Trello = require("node-trello");

var t, screen, mainBox;

var appbg = '#0079bf';
var boxfg = '#4d4d4d';
var boxbg = '#fff';
var boxborder = '#e2e4e6';

function init(trelloKey, trelloToken) {
  t = new Trello(trelloKey, trelloToken);

  screen = blessed.screen({
    smartCSR: true
  });

  screen.title = 'trel';

  mainBox = blessed.box({
    style: {
      bg: appbg
    }
  });

  screen.append(mainBox);

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  screen.render();

  loadBoards();
}

function loadBoards() {
  var loading = blessed.loading({
    top: 'center',
    left: 'center',
    style: {
      fg: '#4d4d4d',
      bg: '#fff'
    },
  });

  loading.load('Loading boards...');

  mainBox.append(loading);

  t.get("/1/members/me", { boards: 'open' }, function(err, data) {
    if (err) throw err;

    var boardNames = [];

    data.boards.forEach(function(board) {
      boardNames.push(board.name);
    });

    var boardList = blessed.list({
      label: '{'+boxbg+'-bg}{'+boxfg+'-fg}Boards{/}',
      tags: true,
      top: 'center',
      left: 'center',
      width: '50%',
      height: '50%',
      items: boardNames,
      style: {
        fg: boxfg,
        bg: boxbg,
        item: {
          hover: {
            bg: 'blue',
            fg: 'white'
          }
        },
        selected: {
          bg: 'blue',
          bold: true
        }
      },
      border: {
        type: 'line',
        fg: boxfg,
        bg: boxbg
      },
      keys: true,
      mouse: true
    });

    mainBox.append(boardList);

    loading.stop();

    boardList.focus();
  });
}

module.exports = {
  init: init
};
