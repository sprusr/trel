var blessed = require('blessed');
var Trello = require("node-trello");

var t, screen;

function init(trelloKey, trelloToken) {
  t = new Trello(trelloKey, trelloToken);

  screen = blessed.screen({
    smartCSR: true
  });

  screen.title = 'trel';

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  screen.render();
}

module.exports = {
  init: init
};
