var inquirer = require('inquirer');
var chalk = require('chalk');
var Trello = require("node-trello");

var t, currentBoard, currentList;
//var ui = new inquirer.ui.BottomBar();

function init(trelloKey, trelloToken) {
  t = new Trello(trelloKey, trelloToken);

  loadBoards();
}

function loadBoards() {
  t.get("/1/members/me", { boards: 'open', board_fields: 'name,closed,idOrganization,pinned,starred' }, function(err, data) {
    if (err) throw err;

    var boards = [];

    data.boards.forEach(function(board) {
      if(board.starred) {
        boards.unshift({
          name: chalk.yellow(board.name),
          value: board
        });
      } else {
        boards.push({
          name: board.name,
          value: board
        });
      }
    });

    inquirer.prompt([
      {
        type: 'list',
        pageSize: boards.length,
        name: 'board',
        message: 'Which board?',
        choices: boards,
        filter: function (val) {
          return val.id;
        }
      }
    ]).then(function(answers) {
      currentBoard = answers.board;
      loadBoard(answers.board);
    });
  });
}

function loadBoard(id) {
  t.get('/1/board/' + id, { lists: 'open' }, function(err, data) {
    if (err) throw err;

    if(data.lists.length) {
      var lists = [];

      data.lists.forEach(function(list) {
        lists.push({
          name: list.name,
          value: list
        });
      });

      inquirer.prompt([
        {
          type: 'list',
          pageSize: lists.length,
          name: 'list',
          message: 'Which list?',
          choices: lists,
          filter: function (val) {
            return val.id;
          }
        }
      ]).then(function(answers) {
        currentList = answers.list;
        loadList(answers.list);
      });
    } else {
      console.log(chalk.red('That board has no lists!'));
    }
  });
}

function loadList(id) {
  t.get('/1/list/' + id, { cards: 'open' }, function(err, data) {
    if (err) throw err;

    if(data.cards.length) {
      var cards = [];

      data.cards.forEach(function(card) {
        cards.push({
          name: card.name,
          value: card
        });
      });

      inquirer.prompt([{
        type: 'list',
        pageSize: cards.length,
        name: 'card',
        message: 'Which card?',
        choices: cards,
        filter: function (val) {
          return val;
        }
      }]).then(function(answers) {
        displayCard(answers.card);
      });
    } else {
      console.log(chalk.red('That list has no cards!'));
    }
  });
}

function displayCard(card) {
  var str = '';

  str += '\n' + chalk.red.bold(card.name);

  if(card.desc) {
    card.desc.split('\n').forEach(function(line) {
      if(line.charAt(0) == '*' || line.charAt(0) == ' ' && line.charAt(1) == '*')
      str += '\n ' + chalk.green(line);
    });
  }

  str += '\n';

  console.log(str);

  inquirer.prompt([
    {
      type: 'list',
      pageSize: 3,
      name: 'action',
      message: 'What do you want to do?',
      choices: [{
        name: 'Back',
        value: {
          func: loadList,
          args: currentList
        }
      }]
    }
  ]).then(function(answers) {
    answers.action.func(answers.action.args);
  });
}

module.exports = {
  init: init
};
