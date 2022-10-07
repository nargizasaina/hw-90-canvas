const express = require('express');
const cors = require('cors')
const {nanoid} = require('nanoid');
const app = express();

require('express-ws')(app);
const port = 8000;

app.use(cors());

const activeConnections = {};

app.ws('/canvas', (ws, req) => {
    const id = nanoid();
    activeConnections[id] = ws;
    console.log('conn');

    ws.on('close', () => {
        console.log('Client disconnected! id=', id);
        delete activeConnections[id];
    });
});

app.listen(port, () => {
    console.log('Server started on port ', port);
});