const prompt = require("prompt-sync")({ sigint: true });
const crypto = require('crypto');

class MoveGenerator {
  constructor(moves) {
    this.moves = moves;
  }

  generateMove() {
    const randomIndex = Math.floor(Math.random() * this.moves.length);
    return this.moves[randomIndex];
  }
}

class HmacGenerator {
  constructor(key) {
    this.key = key;
  }

  generateHmac(move) {
    const hmac = crypto.createHmac('sha256', this.key);
    hmac.update(move);
    return hmac.digest('hex');
  }
}

class GameRules {
  constructor(moves) {
    this.moves = moves;
  }

  getWinner(playerMove, computerMove) {
    const playerIndex = this.moves.indexOf(playerMove);
    const computerIndex = this.moves.indexOf(computerMove);

    if (playerIndex === computerIndex) {
      return 'Draw';
    } else if (
      (playerIndex + 1) % this.moves.length === computerIndex ||
      (playerIndex + 2) % this.moves.length === computerIndex
    ) {
      return 'Player';
    } else {
      return 'Computer';
    }
  }


}
class TableGenerator {
  constructor(moves) {
    this.moves = moves
  }
  generateTable() {
    const numMoves = this.moves.length;
    const table = [['Moves', ...this.moves]];

    for (let i = 0; i < numMoves; i++) {
      const row = [this.moves[i]];
      for (let j = 0; j < numMoves; j++) {
        if (i === j) {
          row.push('Draw');
        } else if (
          (j + 1) % numMoves === i ||
          (j + 2) % numMoves === i
        ) {
          row.push('Win');
        } else {
          row.push('Lose');
        }
      }
      table.push(row);
    }

    return table;
  }
}
function generateRandomKey() {
  return crypto.randomBytes(32);
}

function bytesToHex(buffer) {
  return buffer.toString('hex');
}

function displayTable(table) {
  const header = table[0].join(' | ');
  const separator = '-'.repeat(header.length);

  console.log(header);
  console.log(separator);

  for (let i = 1; i < table.length; i++) {
    const row = table[i].join(' | ');
    console.log(row);
  }
}

function playGame(moves) {
  if (moves.length < 3 || moves.length % 2 === 0 || !areAllUnique(moves)) {
    console.log(
      'Error: Incorrect arguments. Please provide an odd number >= 3 of non-repeating moves.'
    );
    console.log('Example: node rps.js Stone Scissors Paper');
    return;
  }

  const numMoves = moves.length;
  const key = generateRandomKey();
  const moveGenerator = new MoveGenerator(moves);
  const hmacGenerator = new HmacGenerator(key);
  const gameRules = new GameRules(moves);
  const tableGenerator = new TableGenerator(moves);



  const computerMove = moveGenerator.generateMove();
  const hmac = hmacGenerator.generateHmac(computerMove);


  console.log('Menu:');
  for (let i = 0; i < numMoves; i++) {
    console.log(`${i + 1} - ${moves[i]}`);
  }
  console.log('0 - Exit');
  console.log('? - Help');

  let playerChoice;
  do {
    const input = prompt('Enter your choice: ');
    if (input === '?') {
      const table = tableGenerator.generateTable();
      displayTable(table);
    } else {
      playerChoice = parseInt(input, 10);
    }
  } while (playerChoice < 0 || playerChoice > numMoves);

  if (playerChoice === 0) {
    console.log('Exiting the game.');
    return;
  }

  const playerMove = moves[playerChoice - 1];
  const winner = gameRules.getWinner(playerMove, computerMove);

  console.log('Player move: ' + playerMove);
  console.log('Computer move: ' + computerMove);
  console.log('Winner: ' + winner);
  
  console.log('Generated key: ' + bytesToHex(key));
  console.log('HMAC: ' + hmac);
  const table = tableGenerator.generateTable();
  displayTable(table);
}

function areAllUnique(arr) {
  const set = new Set(arr);
  return set.size === arr.length;
}

const moves = process.argv.slice(2);
playGame(moves);
