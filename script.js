// Socket connection
// const socket = new WebSocket('ws://127.0.0.1:5555');

// Initialize the game
// function initializeGame() {
//   rollDiceBtn.addEventListener('click', rollDice);
//   endTurnBtn.addEventListener('click', endTurn);

//   // Disable controls initially
//   rollDiceBtn.disabled = true;
//   endTurnBtn.disabled = true;
// }

// // Socket event handlers
// socket.onopen = function(e) {
//   console.log("Connected to game server");
//   initializeGame();
//   showMessage("Connected to server. Waiting for game to start...");
// };

// socket.onmessage = function(event) {
//   const data = JSON.parse(event.data);
//   console.log("Received:", data);

//   switch(data.type) {
//     case 'join_success':
//       handleJoinSuccess(data);
//       break;
//     case 'game_state_update':
//       updateGameState(data.game_state);
//       break;
//     case 'dice_result':
//       handleDiceResult(data.dice_value, data.current_turn);
//       break;
//     case 'piece_moved':
//       handlePieceMoved(data.piece_id, data.new_position, data.color, data.game_state);
//       break;
//     case 'turn_change':
//       handleTurnChange(data.current_turn, data.game_state);
//       break;
//     case 'error':
//       showMessage(data.message);
//       break;
//   }
// };

// socket.onclose = function(event) {
//   showMessage("Connection to server lost. Please refresh the page.");
// };

// socket.onerror = function(error) {
//   showMessage(`WebSocket error: ${error.message}`);
// };

// Importing All Boards
const blue_Board = document.getElementById("blue-Board");
const green_Board = document.getElementById("green-Board");
const red_Board = document.getElementById("red-Board");
const yellow_Board = document.getElementById("yellow-Board");

// Initial Variables;

let playerTurns = []; // This will hold the players team color
let currentPlayerTurnIndex = 0;
let prevPlayerTurnIndex;
let currentPlayerTurnStatus = true; // True means the user has not yet played and false means played
let teamHasBonus = false; // Bonus when killed, reached Home

let diceResults;

// Setting Player Pieces Class
class Player_Piece {
  constructor(team, position, score, homePathEntry, playerId, gameEntry) {
    this.team = team;
    this.position = position;
    this.score = score;
    this.homePathEntry = homePathEntry;
    this.playerId = playerId;
    this.gameEntry = gameEntry;
    this.status = 0; // Initially it is zero means the piece is locked and 1 means it is unlocked.

    this.initialPosition = position; // To return the piece to the board when killed
  }

  unlockPiece() {
    this.status = 1;
  }

  updatePosition(position) {
    this.position = position;
  }

  movePiece(array) {
    // Function to move the piece
  }

  // Function to return the piece to the locked position when killed
  sentMeToBoard() {}
}

let numPvP = parseInt(prompt("Enter Number of Players (2-4): "));

if (numPvP < 2 || numPvP > 4) {
  confirm("Player should be more than 2 and less than 5");
  location.reload();
} else {
  if (numPvP === 2) {
    playerTurns = ["blue", "green"];
  } else if (numPvP === 3) {
    playerTurns = ["blue", "red", "green"];
  } else if (numPvP === 4) {
    playerTurns = ["blue", "red", "green", "yellow"];
  }
}

let playerPieces = []; // This will hold all pieces from all teams
let boardDetails = [
  { boardColor: "blue", board: blue_Board, homeEntry: "y13", gameEntry: "b1" },
  {
    boardColor: "green",
    board: green_Board,
    homeEntry: "r13",
    gameEntry: "g1",
  },
  { boardColor: "red", board: red_Board, homeEntry: "b13", gameEntry: "r1" },
  {
    boardColor: "yellow",
    board: yellow_Board,
    homeEntry: "g13",
    gameEntry: "yb1",
  },
];

for (let i = 0; i < numPvP; i++) {
  let boardColor = boardDetails[i].boardColor;
  let homeEntry = boardDetails[i].homeEntry;
  let gameEntry = boardDetails[i].gameEntry;

  const parentDiv = document.createElement("div");
  for (let i = 0; i < 4; i++) {
    const span = document.createElement("span");
    const icon = document.createElement("i");
    icon.classList.add(
      "fa-solid",
      "fa-location-pin",
      "piece",
      `${boardColor}-piece`
    );

    icon.addEventListener("click", (e) => {
      // turnForUser(e)
    });

    let pieceID = `${boardColor}${i}`;
    let position = `${i}_${boardColor}`;

    const player = new Player_Piece(
      boardColor,
      position,
      0,
      homeEntry,
      pieceID,
      gameEntry
    );
    span.setAttribute("id", position);
    icon.setAttribute("piece_id", pieceID);
    playerPieces.push(player);
    span.append(icon);
    parentDiv.append(span);
  }
  boardDetails[i].board.append(parentDiv);
}
