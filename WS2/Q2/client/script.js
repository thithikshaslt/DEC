const socket = io();

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let lastX = 0;
let lastY = 0;

ctx.strokeStyle = '#000';
ctx.lineWidth = 2;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', () => (drawing = false));
canvas.addEventListener('mouseout', () => (drawing = false));

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;

    drawLine(lastX, lastY, currentX, currentY, ctx.strokeStyle, ctx.lineWidth);

    socket.emit('draw', {
        x1: lastX,
        y1: lastY,
        x2: currentX,
        y2: currentY,
        color: ctx.strokeStyle,
        lineWidth: ctx.lineWidth,
    });

    [lastX, lastY] = [currentX, currentY];
});

function drawLine(x1, y1, x2, y2, color, lineWidth) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

socket.on('draw', (data) => {
    drawLine(data.x1, data.y1, data.x2, data.y2, data.color, data.lineWidth);
});
