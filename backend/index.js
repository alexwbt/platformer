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
game.saveEvents = true;
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
        if (Math.random() < 0.5)
            game.spawnObject(CLASS_MOB, { x: point.x, y: point.y });
        for (const obj of game.objects)
            if (obj.classType === CLASS_CHARACTER) {
                const dis = Math.pow(point.x - obj.x, 2) + Math.pow(point.y - obj.y, 2);
                if (dis < 250000 && Math.random() < 0.5)
                    game.spawnObject(CLASS_MOB, { x: point.x, y: point.y });
            }
    });
}, 3000);

setInterval(() => {
    io.emit('game-data', game.getData());
}, 10);

setInterval(() => {
    for (const event of game.events) {
        if (event.bullet) {
            let killer = game.objects.find(o => o.objectId === event.bullet.ownerId);
            if (!killer) killer = clients.map(c => c.player).find(p => p.objectId === event.bullet.ownerId);
            if (killer) {
                if (event.diedObj.name)
                    io.emit('game-alert', `${event.diedObj.name} was killed by ${killer.name}`);
                if (event.diedObj.hasBomb) {
                    event.diedObj.hasBomb = false;
                    killer.hasBomb = true;
                    io.emit('game-alert', `${killer.name} has the bomb!`);
                }
            } else if (event.diedObj.name)
                io.emit('game-alert', `${event.diedObj.name} shot himself`);
        } else if (event.fell) {
            if (event.diedObj.name)
                io.emit('game-alert', `${event.diedObj.name} fell out of the world`);
            if (event.diedObj.hasBomb) {
                event.diedObj.hasBomb = false;
                randomBomber();
            }
        } else {
            if (event.diedObj.name)
                io.emit('game-alert', `${event.diedObj.name} was killed by a zombie`);
            if (event.diedObj.hasBomb) {
                event.diedObj.hasBomb = false;
                randomBomber();
            }
        }
    }
    clients.forEach(client => client.update());
    game.events.length = 0;

    if (!gameStarted) {
        if (bombCountdown === 300 && clients.length >= 3) {
            gameStarted = true;
            const bombClient = clients[Math.floor(Math.random() * clients.length)];
            bombClient.player.hasBomb = true;
            io.emit('game-alert', `Game started. ${bombClient.player.name} has the bomb!`);
        }
        if (clients.length < 3) io.emit('bomb-countdown', `Waiting for players to join. (${clients.length}/3)`);
        else if (bombCountdown !== 300) io.emit('bomb-countdown', `Game is starting very soon.`);
    } else {
        bombCountdown--;
        io.emit('bomb-countdown', `The bomb is exploding in ${bombCountdown} seconds!`);

        if (bombCountdown <= 0 || clients.length <= 1) {
            gameStarted = false;
            for (const client of clients) {
                if (client.player.hasBomb) {
                    client.player.hasBomb = false;
                    client.player.explode = true;
                    setTimeout(() => {
                        client.player.explode = false;
                    }, 1000);
                    io.emit('game-alert', `Game ended! ${client.player.name} is the winner!`);
                }
            }
            setTimeout(() => {
                bombCountdown = 300;
            }, 10000);
        }
    }
}, 1000);

const randomBomber = () => {
    if (clients.length <= 0) return;
    const filteredClients = clients.filter(c => !c.player.removed);

    const bombClient = filteredClients.length > 0 && false
        ? filteredClients[Math.floor(Math.random() * filteredClients.length)]
        : clients[Math.floor(Math.random() * clients.length)];
    if (!bombClient) {
        randomBomber();
        return;
    }
    bombClient.player.hasBomb = true;
    io.emit('game-alert', `${bombClient.player.name} has the bomb!`);
};

// game status
let gameStarted = false;
let bombCountdown = 300;

// client
const clients = [];
const addresses = [];
io.on('connection', socket => {
    if (addresses.find(address => address === socket.handshake.address)) {
        return;
    }
    addresses.push(socket.handshake.address);

    const client = {
        address: socket.handshake.address,
        player: game.spawnObject(CLASS_CHARACTER),
        update: () => {
            if (client.player.removed) {
                client.player = game.spawnObject(CLASS_CHARACTER, {
                    name: client.player.name,
                    character: client.player.character,
                    weaponType: client.player.weaponType,
                    hasBomb: client.player.hasBomb,
                });
                socket.emit('player-id', client.player.objectId);
            }
        },
    };

    socket.emit('player-id', client.player.objectId);
    socket.emit('game-data', {
        blocks: game.blocks.map(b => b.getData()),
        decorationBlocks: game.decorationBlocks.map(b => b.getData()),
        mapData: game.mapData,
        bounds: game.bounds,
    });
    if (!gameStarted) {
        socket.emit('game-alert', 'Game has not started yet. Waiting for players to join.');
    }

    socket.on('player-name', name => {
        client.player.name = String(name).slice(-15);
        io.emit('game-alert', `${client.player.name} joined the game`);
        clients.push(client);
    });
    socket.on('player-control', controls => client.player.controls = controls);
    socket.on('player-aim', aim => client.player.aimDir = aim);
    socket.on('player-fire', fire => client.player.weapon.firing = fire);
    socket.on('player-reload', () => client.player.weapon.reload());
    socket.on('player-char', char => client.player.character = char);
    socket.on('player-buy-weapon', weapon => client.player.weapon.buy(weapon));
    socket.on('player-buy-ammo', weapon => client.player.weapon.buyAmmo(weapon));
    socket.on('player-buy-heal', () => client.player.buyHeal());

    socket.on('disconnect', () => {
        client.player.removed = true;
        clients.splice(clients.indexOf(client), 1);
        addresses.splice(addresses.indexOf(socket.handshake.address), 1);
        if (client.player.name) io.emit('game-alert', `${client.player.name} left the game`);
        if (client.player.hasBomb) randomBomber();
    });
});

// start server
http.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});
