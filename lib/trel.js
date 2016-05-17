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
  t.get("/1/members/me", { boards: 'open', board_fields: 'name,closed,idOrganization,pinned,starred', board_organization: true }, function(err, data) {
    if (err) throw err;

    var boards = [], name = '';

    data.boards.forEach(function(board) {
      name = board.name;

      if(board.organization) {
        name += ' ' + chalk.green('- ' + board.organization.displayName);
      }

      if(board.starred) {
        boards.unshift({
          name: chalk.yellow(name),
          value: board
        });
      } else {
        boards.push({
          name: name,
          value: board
        });
      }
    });

    boards = boards.concat([new inquirer.Separator(), 'Quit']);

    inquirer.prompt([
      {
        type: 'list',
        pageSize: boards.length,
        name: 'board',
        message: 'Which board?',
        choices: boards
      }
    ]).then(function(answers) {
      switch (answers.board) {
        case 'Quit':
          //quit
          break;
        default:
          currentBoard = answers.board.id;
          loadBoard(answers.board.id);
      }
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

      lists = lists.concat([new inquirer.Separator(), 'Back']);

      inquirer.prompt([
        {
          type: 'list',
          pageSize: lists.length,
          name: 'list',
          message: 'Which list?',
          choices: lists
        }
      ]).then(function(answers) {
        switch (answers.list) {
          case 'Back':
            loadBoards();
            break;
          default:
            currentList = answers.list.id;
            loadList(answers.list.id);
        }
      });
    } else {
      console.log(chalk.red('That board has no lists!'));
      loadBoards();
      //TODO: show options (new list, etc)
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

      cards = cards.concat([new inquirer.Separator(), 'Back']);

      inquirer.prompt([{
        type: 'list',
        pageSize: cards.length,
        name: 'card',
        message: 'Which card?',
        choices: cards
      }]).then(function(answers) {
        switch (answers.card) {
          case 'Back':
            loadBoard(currentBoard);
            break;
          default:
            displayCard(answers.card);
        }
      });
    } else {
      console.log(chalk.red('That list has no cards!'));
      loadBoard(currentBoard);
      //TODO: show options (new card, etc)
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
      pageSize: 5,
      name: 'action',
      message: 'What do you want to do?',
      choices: ['Move card', 'Edit title', 'Edit description', 'Archive card', new inquirer.Separator(), 'Back']
    }
  ]).then(function(answers) {
    switch (answers.action) {
      case 'Back':
        loadList(currentList);
        break;
      case 'Edit title':
        break;
      case 'Edit description':
        break;
      case 'Move card':
        break;
      case 'Archive card':
        break;
    }
  });
}

module.exports = {
  init: init
};
