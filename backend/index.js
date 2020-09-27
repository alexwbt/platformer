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
const { CLASS_CHARACTER, CLASS_MOB } = require('./game/classes.js');
const initMap = require('./game/map.js');

const game = new Game();
initMap(game);

let startTime = Date.now();
setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - startTime) / 1000;
    startTime = now;
    game.update(deltaTime);
}, 1000 / 60);

setInterval(() => {
    game.mobSpawnPoints.forEach(point => {
        if ((() => {
            for (const obj of game.objects)
                if (obj.classType === CLASS_CHARACTER) {
                    const dis = Math.pow(point.x - obj.x, 2) + Math.pow(point.y - obj.y, 2);
                    if (dis < 40000) return true;
                }
            return false;
        })() && Math.random() < 1) {
            game.spawnObject(CLASS_MOB, { x: point.x, y: point.y });
        }
    });
}, 3000);

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
        player: game.spawnObject(CLASS_CHARACTER),
        update: () => {
            if (client.player.removed) {
                client.player = game.spawnObject(CLASS_CHARACTER, {
                    name: client.player.name,
                    character: client.player.character
                });
                socket.emit('player-id', client.player.objectId);
            }
        },
    };
    clients.push(client);

    console.log(socket.handshake.address);

    socket.emit('player-id', client.player.objectId);
    socket.emit('game-data', {
        blocks: game.blocks.map(b => b.getData()),
        mapData: game.mapData,
        bounds: game.bounds,
    });

    socket.on('player-control', controls => client.player.controls = controls);
    socket.on('player-aim', aim => client.player.aimDir = aim);
    socket.on('player-fire', fire => client.player.weapon.firing = fire);
    socket.on('player-reload', () => client.player.weapon.reload());
    socket.on('player-name', name => client.player.name = name);
    socket.on('player-char', char => client.player.character = char);

    socket.on('disconnect', () => {
        client.player.removed = true;
        clients.splice(clients.indexOf(client), 1);
    });
});

// start server
http.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});
