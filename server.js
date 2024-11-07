const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const columnRoutes = require('./routes/columnRoutes');
const collaboratorRoutes = require('./routes/collaboratorRoutes');
const cardRoutes = require('./routes/cardRoutes');

dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', boardRoutes);
app.use('/api', columnRoutes);
app.use('/api', cardRoutes);
app.use('/api', collaboratorRoutes);

let boardClients = {};

wss.on('connection', (ws, req) => {
    const boardId = req.url.split('/').pop();
    if (!boardClients[boardId]) boardClients[boardId] = [];
    boardClients[boardId].push(ws);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'UPDATE_COLUMNS') {
            boardClients[boardId].forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'UPDATE_COLUMNS', columns: data.columns }));
                }
            });
        }
    });

    ws.on('close', () => {
        boardClients[boardId] = boardClients[boardId].filter(client => client !== ws);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// const updatedColumns = columns.map(col => {
            //     if (col.id === editingCard.columnId) {
            //         return {
            //             ...col,
            //             cards: col.cards.map(card => (card.id === editingCard.id ? res.data : card)),
            //         };
            //     }
            //     return col;
            // });
            // // Perbarui state dan kirim data ke WebSocket
            // updateColumns(updatedColumns);
            // updateColumns(columns.map(col => ({
            //     ...col,
            //     cards: col.cards.filter(card => card.id === editingCard.id ? res.data : card),
            // })));