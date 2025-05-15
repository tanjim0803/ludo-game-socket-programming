from flask import Flask, render_template, request, session, send_from_directory, redirect, url_for
from flask_socketio import SocketIO, emit, join_room
from collections import defaultdict
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, async_mode='eventlet')
# In server.py
socketio = SocketIO(app, cors_allowed_origins="*")

# Game lobbies storage
lobbies = defaultdict(dict)
players = defaultdict(dict)

connected_players = {}


@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/lobby/<room_id>')
def lobby(room_id):
    if room_id not in lobbies:
        return redirect(url_for('index'))  # Redirect to home if invalid room
    return render_template('lobby.html', 
                         room_id=room_id,
                         max_players=lobbies[room_id]['max_players'])

@app.route('/game/<room_id>')
def game(room_id):
    if room_id not in lobbies or not lobbies[room_id]['game_started']:
        return redirect('/')
    return render_template('ludo.html', room_id=room_id)

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
    connected_players[request.sid] = {'room': None}

# Add to your existing SocketIO handlers
@socketio.on('create_lobby')
def handle_create_lobby(data):
    try:
        max_players = int(data['max_players'])
        room_id = str(random.randint(1000, 9999))
        
        lobbies[room_id] = {
            'max_players': max_players,
            'players': {},
            'game_started': False,
            'colors': ['red', 'green', 'yellow', 'blue']
        }
        
        # Generate shareable link
        share_link = f"{request.host_url}?join={room_id}"
        
        emit('lobby_created', {
            'room_id': room_id,
            'share_link': share_link
        })
        
    except Exception as e:
        emit('error', {'message': f'Failed to create lobby: {str(e)}'})

@socketio.on('join_lobby')
def handle_join_lobby(data):
    room_id = data.get('room_id')
    player_name = data.get('player_name')
    
    if not room_id or not player_name:
        emit('error', {'message': 'Missing room ID or player name'})
        return
        
    if room_id not in lobbies:
        emit('error', {'message': 'Lobby not found'})
        return
        
    lobby = lobbies[room_id]
    
    if len(lobby['players']) >= lobby['max_players']:
        emit('error', {'message': 'Lobby is full'})
        return
    
    # Assign color
    if not lobby['colors']:
        emit('error', {'message': 'No colors available'})
        return
        
    color = lobby['colors'].pop(0)
    
    # Add player to lobby
    lobby['players'][request.sid] = {
        'name': player_name,
        'color': color,
        'ready': False
    }
    
    join_room(room_id)
    emit('player_update', {
        'players': list(lobby['players'].values()),
        'max_players': lobby['max_players'],
        'all_ready': False
    }, room=room_id)

@socketio.on('ready')
def handle_ready():
    sid = request.sid
    print(f"Player {sid} is ready")  # Debug
    
    if sid not in players:
        emit('error', {'message': 'Player not in any lobby'})
        return
        
    room_id = players[sid]['room_id']
    lobby = lobbies[room_id]
    
    if sid not in lobby['players']:
        emit('error', {'message': 'Player not found in lobby'})
        return
    
    # Mark player as ready
    lobby['players'][sid]['ready'] = True
    print(f"Player {lobby['players'][sid]['name']} is ready")  # Debug
    
    # Check if all ready
    all_ready = all(player['ready'] for player in lobby['players'].values())
    print(f"All ready status: {all_ready}")  # Debug
    
    emit('player_update', {
        'players': list(lobby['players'].values()),
        'max_players': lobby['max_players'],
        'all_ready': all_ready
    }, room=room_id)
    
    if all_ready and len(lobby['players']) == lobby['max_players']:
        print("Starting game for room:", room_id)  # Debug
        lobby['game_started'] = True
        emit('game_start', {
            'players': list(lobby['players'].values()),
            'room_id': room_id
        }, room=room_id)

@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    print(f"Client disconnected: {sid}")
    if sid in connected_players:
        room_id = connected_players[sid]['room']
        if room_id and room_id in lobbies:
            # Handle player leaving lobby
            lobby = lobbies[room_id]
            if sid in lobby['players']:
                color = lobby['players'][sid]['color']
                lobby['colors'].append(color)
                del lobby['players'][sid]
                emit('player_update', {
                    'players': list(lobby['players'].values()),
                    'max_players': lobby['max_players'],
                    'all_ready': False
                }, room=room_id)
        del connected_players[sid]

if __name__ == '__main__':
    socketio.run(app, debug=True)