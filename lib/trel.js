var blessed = require('blessed');
var Trello = require("node-trello");

var t, screen;

function init(trelloKey, trelloToken) {
  t = new Trello(trelloKey, trelloToken);

  screen = blessed.screen({
    smartCSR: true
  });

  screen.title = 'trel';

  var loading = blessed.loading({
    top: 'center',
    left: 'center',
    border: {
      type: 'line'
    }
  });

  loading.load('Loading board...');

  screen.append(loading);

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  screen.render();

  setTimeout(function() {
    loading.stop();
  }, 1000);
}

module.exports = {
  init: init
};
