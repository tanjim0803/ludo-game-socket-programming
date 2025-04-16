import socket
import threading
import json
import random
from time import sleep

class LudoServer:
    def __init__(self):
        self.host = '127.0.0.1'
        self.port = 5555
        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server.bind((self.host, self.port))
        self.server.listen()
        
        self.clients = []
        self.players = {}
        self.game_state = {
            "current_turn": 0,
            "dice_value": 0,
            "pieces_positions": {},
            "player_turns": [],
            "num_players": 0,
            "game_started": False
        }
        
    def broadcast(self, message):
        """Send message to all connected clients"""
        for client in self.clients:
            try:
                client.send(message.encode('utf-8'))
            except:
                self.clients.remove(client)

    def handle_client(self, client, address):
        """Handle individual client connections"""
        print(f"New connection from {address}")
        self.clients.append(client)
        
        while True:
            try:
                message = client.recv(1024).decode('utf-8')
                if not message:
                    break
                    
                data = json.loads(message)
                self.process_message(data, client)
                
            except Exception as e:
                print(f"Error with client {address}: {e}")
                self.remove_client(client)
                break

if __name__ == "__main__":
    server = LudoServer()
    server.start()