const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();

require('express-ws')(app);
const port = 8000;

app.use(cors());

const activeConnections = {};

app.ws('/draw', (ws, req) => {
    const id = nanoid();
    activeConnections[id] = ws;
    console.log('conn', id);

    ws.on('close', () => {
        console.log('Client disconnected! id=', id);
        delete activeConnections[id];
    });

    ws.on('message', msg => {
        const decodedMessage = JSON.parse(msg);

        switch (decodedMessage.type) {
            case 'CREATE_LINE':
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];

                    conn.send(JSON.stringify({
                        type: 'NEW_LINE',
                        message: decodedMessage.message,
                    }));
                });
                break;
            default:
                console.log('Unknown message type: ', decodedMessage.type);
        }
        ws.send(msg);
    });
});

app.listen(port, () => {
    console.log('Server started on port ', port);
});