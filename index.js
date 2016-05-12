#!/usr/bin/env node

var blessed = require('blessed');

var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'trl';

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();
