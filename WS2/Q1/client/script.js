const socket = io();

const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = messageInput.value;
    if (msg.trim()) {
        socket.emit('chat message', msg); 
        messageInput.value = '';         
    }
});

socket.on('chat message', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; 
});
