#!/usr/bin/env node

var nconf = require('nconf');
var trel = require('./lib/trel.js');

nconf.argv().env();

var trelloKey = nconf.get('TRELLO_DEVELOPER_PUBLIC_KEY');
var trelloToken = nconf.get('TRELLO_MEMBER_TOKEN');

if(trelloKey && trelloToken) {
  trel.init();
} else {
  console.log('ERROR! Please define TRELLO_DEVELOPER_PUBLIC_KEY and TRELLO_MEMBER_TOKEN. See documentation for more info.')
}
