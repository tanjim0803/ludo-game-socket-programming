// Socket
// Add right after the script loaded check
const socket = io.connect();
console.log("Socket connected:", socket.connected); // Should log true

socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

//dom elemnts
const redPlayer = document.querySelector(".redPlayer");
const greenPlayer = document.querySelector(".greenPlayer");
const yellowPlayer = document.querySelector(".yellowPlayer");
const bluePlayer = document.querySelector(".bluePlayer");
const play = document.querySelector("#play");
const menu = document.querySelector(".startMenu");
// Audios ..
const click = new Audio("../sounds/mixkit-classic-click.wav");
//others
let redPlaying = false;
let greenPlaying = false;
let yellowPlaying = false;
let bluePlaying = false;
let nPlaying = 0;

//selecting click events
redPlayer.addEventListener("click", slected);
greenPlayer.addEventListener("click", slected);
yellowPlayer.addEventListener("click", slected);
bluePlayer.addEventListener("click", slected);

//to start playing game
play.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Play button clicked"); // Check if click is registered
  startGame();
});

//to check if no of player is more than 2
function canPlay() {
  if (nPlaying >= 2) {
    return true;
  } else {
    return false;
  }
}
//toggle if already selected then deselected and vica versa
function slected() {
  click.play();
  let playerId = this.id;
  console.log(playerId);
  let player = document.querySelector(`#${playerId}`);
  if (player.classList.contains("selected")) {
    nPlaying--;
    switch (playerId) {
      case "redPlayer":
        redPlaying = false;
        break;
      case "bluePlayer":
        bluePlaying = false;
        break;
      case "greenPlayer":
        greenPlaying = false;
        break;
      case "yellowPlayer":
        yellowPlaying = false;
        break;
    }
    player.classList.remove("selected");
    console.log("player deseleted", player);
  } else {
    nPlaying++;
    switch (playerId) {
      case "redPlayer":
        redPlaying = true;
        break;
      case "bluePlayer":
        bluePlaying = true;
        break;
      case "greenPlayer":
        greenPlaying = true;
        break;
      case "yellowPlayer":
        yellowPlaying = true;
        break;
    }
    player.classList.add("selected");
    console.log("player seleted", player);
  }
  console.log("n playing ", nPlaying);
}

// Modify the startGame function
function startGame() {
  if (canPlay()) {
    click.play();
    const playerName = prompt("Enter your name:");

    if (playerName) {
      // Store player name and selections in localStorage
      localStorage.setItem("playerName", playerName);
      localStorage.setItem(
        "playerSelections",
        JSON.stringify({
          red: redPlaying,
          green: greenPlaying,
          yellow: yellowPlaying,
          blue: bluePlaying,
        })
      );

      menu.style.animation = "closing 0.5s linear";
      setTimeout(() => {
        socket.emit("create_lobby", {
          max_players: nPlaying,
          player_name: playerName,
        });
      }, 500);
    }
  }
}

// Handle lobby creation response
socket.on("lobby_created", (data) => {
  // Store room ID for other tabs
  localStorage.setItem("lobbyRoomId", data.room_id);
  window.location.href = `/lobby/${data.room_id}`;
});

// Handle join links for additional players
if (window.location.search.includes("join=")) {
  const roomId = new URLSearchParams(window.location.search).get("join");
  localStorage.setItem("lobbyRoomId", roomId);
  window.location.href = `/lobby/${roomId}`;
}
