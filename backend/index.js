require('dotenv').config();
const { PORT } = process.env;
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(require('cors')());
app.use(express.static('game'));

// game
const Game = require('./game/index.js');
const { CLASS_CHARACTER, CLASS_BLOCK } = require('./game/classes.js');

const game = new Game();

let startTime = Date.now();
setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - startTime) / 1000;
    startTime = now;
    game.update(deltaTime);
}, 1000 / 60);

setInterval(() => {
    io.emit('game-data', game.getData());
}, 10);

setInterval(() => {
    clients.forEach(client => client.update());
}, 1000);

// client
const clients = [];
io.on('connection', socket => {
    const client = {
        player: game.spawnObject(CLASS_CHARACTER, { y: 25 }),
        update: () => {
            if (client.player.removed) {
                client.player = game.spawnObject(CLASS_CHARACTER, { y: 25, name: client.player.name });
                socket.emit('player-id', client.player.objectId);
            }
        },
    };
    clients.push(client);

    socket.emit('player-id', client.player.objectId);

    socket.on('player-control', controls => client.player.controls = controls);
    socket.on('player-aim', aim => client.player.aimDir = aim);
    socket.on('player-fire', fire => client.player.weapon.firing = fire);
    socket.on('player-name', name => client.player.name = name);

    socket.on('disconnect', () => {
        client.player.removed = true;
        clients.splice(clients.indexOf(client), 1);
    });
});

// start server
http.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});
