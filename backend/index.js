require('dotenv').config();
const { PORT } = process.env;
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const client = require('./client');
io.on('connection', client.connection);

app.use(require('cors')());
app.use(express.static('game'));

// game
const Game = require('./game/index.js');
const { CLASS_PLAYER, CLASS_BLOCK } = require('./game/index.js');

const game = new Game();

game.spawnObject(CLASS_PLAYER);
game.spawnObject(CLASS_BLOCK, { y: 15, width: 200 });

let startTime = Date.now();
setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - startTime);
    startTime = now;
    game.update(deltaTime);
    game.render();
}, 1000 / 60);

setInterval(() => {
    io.emit('game-data', game.getData());
}, 10);

http.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});
