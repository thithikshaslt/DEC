import socket
import threading
import sys

def receive_messages(server_socket):
    while True:
        try:
            msg = server_socket.recv(1024).decode('utf-8')
            if msg:
                print(f"\n{msg}")
            else:
                print("[SERVER DISCONNECTED]")
                break
        except:
            print("[ERROR] Connection lost.")
            break
    server_socket.close()

def send_messages(server_socket):
    print("Type 'exit' to leave the chat room.")
    while True:
        msg = input()
        if msg.lower() == "exit":
            print("[DISCONNECTING]")
            server_socket.sendall(msg.encode('utf-8'))
            break
        server_socket.sendall(msg.encode('utf-8'))

def connect_to_server(server_ip, server_port):
    try:
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((server_ip, server_port))
        print("[CONNECTED] Connected to the server.")

        threading.Thread(target=receive_messages, args=(client_socket,)).start()
        send_messages(client_socket)

    except ConnectionRefusedError:
        print("[ERROR] Unable to connect to the server. Is it running?")
    except Exception as e:
        print(f"[ERROR] {str(e)}")
    finally:
        client_socket.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python client.py <Server IP> <Server Port>")
    else:
        SERVER_IP = sys.argv[1]
        SERVER_PORT = int(sys.argv[2])
        connect_to_server(SERVER_IP, SERVER_PORT)
