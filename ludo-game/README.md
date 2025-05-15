# Ludo Game

## Overview
This is a web-based implementation of the classic board game Ludo, built using:

1. Frontend: HTML, CSS, JavaScript

2. Backend: Python with Flask

3. Styling: Bootstrap


## Features
The game supports 2-4 players with the traditional Ludo rules and mechanics.
1. Player selection screen (2-4 players)

2. Interactive game board with animated dice rolling

3. Token movement based on dice rolls

4. Special rules for 6s (extra turns)

5. Token capturing mechanics

6. Win detection and ranking system (1st, 2nd, 3rd place)

7. Responsive design that works on different screen sizes

## Game Rules Implemented
1. Players take turns rolling a dice

2. A 6 grants an extra turn and allows bringing a new token into play

3. Tokens move clockwise around the board

4. Landing on an opponent's token sends it back to their starting area

5. Safe spots (star places) protect tokens from being captured

6. First player to get all tokens home wins

## Technical Implementation

### Frontend:

1. Custom CSS animations for dice rolling and token movement

2. Event-driven JavaScript for game logic

3. Responsive design with media queries

4. Dynamic DOM manipulation for game state

### Backend:

1. Flask server to handle routing

2. Jinja2 templating for dynamic HTML

3. URL parameters to pass game settings between pages

### How to Run
1. Install requirements: pip install flask

2. Run the server: python server.py

3. Open in browser: http://127.0.0.1:5000/

### Future Improvements
1. Add multiplayer functionality over network

2. Implement AI opponents

3. Add game statistics and history

4. Improve mobile touch controls

5. Add more customization options