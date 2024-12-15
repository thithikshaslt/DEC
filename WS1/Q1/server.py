import socket
import threading

HOST = '0.0.0.0'
PORT = 1122

connected_clients = []

def broadcast_message(msg, sender_socket):
    for client in connected_clients:
        if client != sender_socket:
            try:
                client.sendall(msg.encode('utf-8'))
            except:
                remove_client(client)

def handle_client(client_socket, client_address):
    print(f"[NEW CONNECTION] {client_address} connected.")
    connected_clients.append(client_socket)

    while True:
        try:
            msg = client_socket.recv(1024).decode('utf-8')
            if msg:
                print(f"[{client_address}] {msg}")
                broadcast_message(f"[{client_address}] {msg}", client_socket)
            else:
                break
        except:
            break

    remove_client(client_socket)
    print(f"[DISCONNECTED] {client_address} disconnected.")

def remove_client(client_socket):
    if client_socket in connected_clients:
        connected_clients.remove(client_socket)
    client_socket.close()

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((HOST, PORT))
    server_socket.listen()

    print(f"[SERVER STARTED] Listening on {HOST}:{PORT}...")
    while True:
        client_socket, client_address = server_socket.accept()
        threading.Thread(target=handle_client, args=(client_socket, client_address)).start()

if __name__ == "__main__":
    start_server()
